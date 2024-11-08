package petadoption.api.recommendationEngine;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.nd4j.shade.protobuf.MapEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceRepository;
import petadoption.api.preferences.PreferenceService;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final AttributeEmbedding attributeEmbedding;
    private final PreferenceService preferenceService;
    private final OwnerService ownerService;
    private final Word2Vec word2Vec;
    private final PetService petService;



    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences) throws IOException {
        Long preferenceID = ownerService.getPreferenceIdByOwnerID(ownerId);
        Preference oldPref = null;
        boolean isNewPreference = false;

        if (preferenceID != null) {
            oldPref = preferenceService.getPreferences(preferenceID);
        }
        if (oldPref == null){
            // No existing preference, create a new one.
            isNewPreference = true;
            oldPref = new Preference();
        }
        Preference newPref = extractArgsFromString(newPreferences, oldPref);
        double[] embeddingVector = generatePreferenceVector(newPref);
        try{
            if(isNewPreference){
                newPref = preferenceService.createPreference(newPref);
                ownerService.savePreference(ownerId, newPref);
            }else{
                preferenceService.updatePreferences(preferenceID, newPref);
            }
            //preferenceRepository.updatePreferences(id, newPref); updatePreferences
        }catch (Exception e){
            throw new IOException("Error saving preference: ", e);
        }
        return embeddingVector;
    }


    private Preference extractArgsFromString(List<String> preference, Preference oldPref) throws IOException{
        if(preference.size() < 4){
            throw new IOException("Not enough arguments in the preference vector");
        }
        oldPref.setPreferredSpecies(preference.get(0));
        oldPref.setPreferredBreed(preference.get(1));
        oldPref.setPreferredColor(preference.get(2));
        oldPref.setPreferredAge(Integer.parseInt(preference.get(3)));

        return oldPref;
    }

    public double[] generatePreferenceVector(Preference preference) {
        List<String> newWords = new ArrayList<>();

        double[] speciesVector = getOrAddWordVector(word2Vec, preference.getPreferredSpecies(), newWords);
        double[] breedVector = getOrAddWordVector(word2Vec, preference.getPreferredBreed(), newWords);
        double[] colorVector = getOrAddWordVector(word2Vec, preference.getPreferredColor(), newWords);
        double[] ageVector = getOrAddWordVector(word2Vec, String.valueOf(preference.getPreferredAge()), newWords);

        double speciesWeight = 1.5;
        double breedWeight = 1.2;
        double colorWeight = 1.0;
        double ageWeight = 1.0;

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

    public List<Pet> findKthNearestNeighbors(double[] userWeights, int k){
        List<Pet> allPets = petService.getAllPets();
        if(allPets.isEmpty() || userWeights.length < k){
            return allPets;
        }

        Map<Long, Double> allPetsWeights = new HashMap<>();

        for (Pet pet : allPets) {
            // Todo: potentially add a prefilter system.
            Long petID = pet.getPetId();
            Preference petStats = new Preference();
            petStats.setPreferredSpecies(pet.getSpecies());
            petStats.setPreferredBreed(pet.getBreed());
            petStats.setPreferredColor(pet.getColor());
            petStats.setPreferredAge(pet.getAge());
            double[] petVector = generatePreferenceVector(petStats);
            allPetsWeights.put(petID, VectorUtils.cosineSimilarity(userWeights, petVector));
        }

        List<Long> kMatchedPets = allPetsWeights.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .limit(k).map(x -> x.getKey()).toList();


        List<Pet> matchedPets = new ArrayList<>();
        kMatchedPets.stream().forEach( x -> matchedPets.add(petService.getPetById(x).get()));

        return matchedPets;

    }




}
