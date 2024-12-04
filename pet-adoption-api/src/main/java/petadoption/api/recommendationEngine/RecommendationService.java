package petadoption.api.recommendationEngine;

import io.milvus.v2.client.MilvusClientV2;
import lombok.RequiredArgsConstructor;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.stereotype.Service;
import petadoption.api.milvus.MilvusServiceAdapter;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.user.Owner.OwnerService;
import petadoption.api.user.Owner.SeenPetService;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static java.lang.Math.abs;
import static java.lang.Math.floor;


@Service
@RequiredArgsConstructor
@ConditionalOnBean(MilvusServiceAdapter.class)
public class RecommendationService {
    private final AttributeEmbedding attributeEmbedding;
    private final Word2Vec word2Vec;
    private final PetService petService;
    private final SeenPetService seenPetService;
    private final MilvusServiceAdapter milvusServiceAdapter;

    public static final String PET_PARTITION = "PET_PARTITION";
    public final String OWNER_PARTITION = "OWNER_PARTITION";

    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences, int coldStart) {
        try {
            return savePreferenceEmbedding(ownerId, newPreferences, 1.0, coldStart);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences, double skewBias) {
        try {
            return savePreferenceEmbedding(ownerId, newPreferences, skewBias, 0);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences, double skewBias, int coldStart) throws IOException {
        double[] preferences = milvusServiceAdapter.getData(ownerId, OWNER_PARTITION);

        Preference newPref = extractArgsFromString(newPreferences);
        double[] embeddingVector = (skewBias == 1.0 ?
                 generatePreferenceVector(newPref, coldStart) :
                 generatePreferenceVector(newPref, skewBias));

        try{
            if(preferences != null){

                double weightOfOld = 0.75;
                double weightOfNew= 0.25;

                embeddingVector = VectorUtils.combineVectors(preferences, weightOfOld, embeddingVector, weightOfNew);
            }

            milvusServiceAdapter.upsertData(ownerId,embeddingVector,embeddingVector.length,OWNER_PARTITION);

        }catch (Exception e){
            throw new RuntimeException(e.getMessage(), e);
        }
        return embeddingVector;
    }

    private Preference extractArgsFromString(List<String> preference) throws IOException{
        if(preference.size() < 4){
            throw new IOException("Not enough arguments in the preference vector");
        }
        Preference pref = new Preference();
        pref.setPreferredSpecies(preference.get(0).toLowerCase().replaceAll("\\s+", ""));
        pref.setPreferredBreed(preference.get(1).toLowerCase().replaceAll("\\s+", ""));
        pref.setPreferredColor(preference.get(2).toLowerCase().replaceAll("\\s+", ""));
        pref.setPreferredAge(Integer.parseInt(preference.get(3)));

        return pref;
    }

    public double[] generatePreferenceVector(Pet pet) throws IOException {
        Preference petStats = new Preference();

        petStats.setPreferredSpecies(pet.getSpecies().toLowerCase().replaceAll("\\s+", ""));
        petStats.setPreferredBreed(pet.getBreed().toLowerCase().replaceAll("\\s+", ""));
        petStats.setPreferredColor(pet.getColor().toLowerCase().replaceAll("\\s+", ""));
        petStats.setPreferredAge(pet.getAge());

        return generatePreferenceVector(petStats);

    }

    public double[] generatePreferenceVector(Preference preference, int coldStart) {
        int adjustmentRounds = 5;
        double[] speciesWeights = {1.6, 1.55, 1.50, 1.45, 1.40};
        double[] breedWeights =   {1.2, 1.25, 1.3 , 1.35, 1.35};
        double[] colorWeights =   {1.0, 1.0,  1.15, 1.20, 1.25};
        double [] ageWeights=     {1.0, 1.0,  1.15, 1.20, 1.25};
        double speciesWeight, breedWeight, colorWeight, ageWeight;

        double incrementFactor = 2.0;
        int ndx = (int)floor(abs(coldStart)/incrementFactor);

        if(ndx > adjustmentRounds - 1){
            ndx = adjustmentRounds - 1;
        }

        System.out.println("ndx: " + ndx);

        speciesWeight = speciesWeights[ndx];
        breedWeight = breedWeights[ndx];
        colorWeight = colorWeights[ndx];
        ageWeight = ageWeights[ndx];

        return generatePreferenceVector(preference, speciesWeight, breedWeight, colorWeight, ageWeight);
    }

    public double[] generatePreferenceVector(Preference preference) {
        return generatePreferenceVector(preference, 1.5, 1.2, 1.0, 1.0);
    }

    public double[] generatePreferenceVector(Preference preference, double skewBias) {
        return generatePreferenceVector(preference, skewBias, 1.0, 1.0, 1.0);
    }

    public double[] generatePreferenceVector(Preference preference,
                                             double speciesWeight, double breedWeight, double colorWeight, double ageWeight) {
        List<String> newWords = new ArrayList<>();

        double[] speciesVector = getOrAddWordVector(word2Vec, preference.getPreferredSpecies(), newWords);
        double[] breedVector = getOrAddWordVector(word2Vec, preference.getPreferredBreed(), newWords);
        double[] colorVector = getOrAddWordVector(word2Vec, preference.getPreferredColor(), newWords);
        double[] ageVector = getOrAddWordVector(word2Vec, String.valueOf(preference.getPreferredAge()), newWords);


        INDArray speciesVec = Nd4j.create(speciesVector).mul(speciesWeight);
        INDArray breedVec = Nd4j.create(breedVector).mul(breedWeight);
        INDArray colorVec = Nd4j.create(colorVector).mul(colorWeight);
        INDArray ageVec = Nd4j.create(ageVector).mul(ageWeight);


        if (!newWords.isEmpty()) {
            attributeEmbedding.addNewSentences(newWords);
            attributeEmbedding.retrainModel();
        }

        INDArray preferenceVector = speciesVec.add(breedVec).add(colorVec).add(ageVec)
                .div(speciesWeight + breedWeight + colorWeight + ageWeight);
        return preferenceVector.toDoubleVector();
    }

    private double[] getOrAddWordVector(Word2Vec word2Vec, String word, List<String> newWords) {
        if (word2Vec.hasWord(word)) {
            return word2Vec.getWordVector(word);
        } else {
            newWords.add(word);
            return new double[word2Vec.getLayerSize()];
        }
    }

    public List<Pet> findKthNearestNeighbors(long ownerId, double[] userWeights, int k) throws Exception{
        try {

            List<Long> seenPets = seenPetService.getSeenPets(ownerId);

            if (seenPets.size() >= petService.numberOfPets()) {
                seenPetService.resetSeenPets(ownerId);
                seenPets = new ArrayList<>();
            }

            List<Long> matchedPetIds = milvusServiceAdapter.findKthNearest(userWeights, seenPets, k,PET_PARTITION);

            List<Pet> matchedPets = new ArrayList<>();

            for(Long petId : matchedPetIds){
                petService.getPetById(petId).ifPresent(matchedPets::add);
            }

            seenPetService.addSeenPets(ownerId, matchedPets);

            return matchedPets;
        }catch (Exception e){
            throw new SQLException(e.getMessage(), e);
        }

    }

    public List<Pet> coldStart(int coldStartVal) {
        List<String> availableSpecies = petService.distinctSpecies();
        List<String> searchList = availableSpecies;
        int[] startIndices = {6,2,0};
        List<Pet> pets = new ArrayList<>();

        if (availableSpecies.isEmpty()) {
            throw new RuntimeException("No Species in Database");
        }

        while (availableSpecies.size() < 3) {
            searchList.add(availableSpecies.getFirst());
        }

        if (availableSpecies.size() > 3) {
            int windowBegin = startIndices[coldStartVal - 1];
            searchList = new ArrayList<>();
            for(int i = windowBegin; i < windowBegin + 3; i++) {
                searchList.add(availableSpecies.get(i % availableSpecies.size()));
            }
        }

        for(String species : searchList) {
            pets.add(petService.findRandomPetBySpecies(species));
        }

        return pets;
    }
}
