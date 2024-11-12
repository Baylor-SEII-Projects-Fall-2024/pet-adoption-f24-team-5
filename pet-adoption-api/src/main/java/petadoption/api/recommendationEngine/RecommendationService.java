package petadoption.api.recommendationEngine;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeights;
import petadoption.api.preferences.PreferenceWeightsService;
import petadoption.api.user.Owner.OwnerService;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final AttributeEmbedding attributeEmbedding;
    private final PreferenceWeightsService preferenceWeightsService;
    private final OwnerService ownerService;
    private final Word2Vec word2Vec;
    private final PetService petService;



    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences) throws IOException {
        Long preferenceID = ownerService.getPreferenceWeightsIdByOwnerID(ownerId);
        PreferenceWeights oldPref = null;
        boolean isNewPreference = false;

        if (preferenceID != null) {
            oldPref = preferenceWeightsService.getPreferenceWeights(preferenceID);
        }
        if (oldPref == null){
            // No existing preference, create a new one.
            isNewPreference = true;
        }
        Preference newPref = extractArgsFromString(newPreferences);
        double[] embeddingVector = generatePreferenceVector(newPref);
        PreferenceWeights newWeights = new PreferenceWeights(embeddingVector);
        try{
            if(isNewPreference){
                //No existing weights so create new weights
                preferenceWeightsService.savePreferenceWeights(newWeights);
                ownerService.savePreferenceWeights(ownerId, newWeights);
            }else{
                // Incorperates new preference into the existing one
                double weightOfOld = 0.7;
                double weightOfNew= 0.3;

                embeddingVector = VectorUtils.combineVectors(oldPref.getAllWeights(), weightOfOld, newWeights.getAllWeights(), weightOfNew);
                preferenceWeightsService.updatePreferenceWeights(preferenceID, new PreferenceWeights(embeddingVector));
            }
            //preferenceRepository.updatePreferences(id, newPref); updatePreferences
        }catch (Exception e){
            throw new IOException("Error saving preference: ", e);
        }
        return embeddingVector;
    }


    private Preference extractArgsFromString(List<String> preference) throws IOException{
        if(preference.size() < 4){
            throw new IOException("Not enough arguments in the preference vector");
        }
        Preference pref = new Preference();
        pref.setPreferredSpecies(preference.get(0));
        pref.setPreferredBreed(preference.get(1));
        pref.setPreferredColor(preference.get(2));
        pref.setPreferredAge(Integer.parseInt(preference.get(3)));

        return pref;
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


    public int getColdStartValue(long userId) throws IOException{
        Long weightID = ownerService.getPreferenceWeightsIdByOwnerID(userId);
        if(weightID == null){
            throw new IOException("Did not find user with ID: " + userId);
        }
        Optional<Integer> coldStartResult = preferenceWeightsService.getColdStartValue(weightID);
        if(coldStartResult.isPresent()){
            return coldStartResult.get();
        }
        throw new IOException("Did not find weight with ID: " + weightID);
    }

    public int setColdStartValue(long userId, int coldStartValue) throws IOException{

        Long weightID = ownerService.getPreferenceWeightsIdByOwnerID(userId);
        if(weightID == null){
            throw new IOException("Did not find user with ID: " + userId);
        }

        return preferenceWeightsService.setColdStartValue(weightID, coldStartValue);
    }

    public double[] getUsersWeights(long id) {
        PreferenceWeights preferenceWeights = preferenceWeightsService.getPreferenceWeights(id);
        if(preferenceWeights != null){
            return preferenceWeights.getAllWeights();
        }
        return null;
    }
}
