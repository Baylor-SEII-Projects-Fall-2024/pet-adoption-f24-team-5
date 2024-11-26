package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.deeplearning4j.models.word2vec.Word2Vec;
import org.nd4j.linalg.api.ndarray.INDArray;
import org.nd4j.linalg.factory.Nd4j;
import org.springframework.stereotype.Service;
import petadoption.api.milvus.MilvusServiceAdapter;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.user.Owner.OwnerService;
import petadoption.api.user.Owner.SeenPetService;
import petadoption.api.user.Owner.SeenPets;

import java.io.IOException;
import java.sql.SQLException;
import java.util.*;


@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final AttributeEmbedding attributeEmbedding;
    private final OwnerService ownerService;
    private final Word2Vec word2Vec;
    private final PetService petService;
    private final SeenPetService seenPetService;
    private final MilvusServiceAdapter milvusServiceAdapter;

    public static final String PET_PARTITION = "PET_PARTITION";
    public final String OWNER_PARTITION = "OWNER_PARTITION";

    public double[] savePreferenceEmbedding(Long ownerId, List<String> newPreferences) throws IOException {
        double[] preferences = milvusServiceAdapter.getData(ownerId, OWNER_PARTITION);

        Preference newPref = extractArgsFromString(newPreferences);
        double[] embeddingVector = generatePreferenceVector(newPref);

        try{
            if(!(preferences == null)){

                double weightOfOld = 0.7;
                double weightOfNew= 0.3;

                embeddingVector = VectorUtils.combineVectors(preferences, weightOfOld, embeddingVector, weightOfNew);
            }

            milvusServiceAdapter.upsertData(ownerId,embeddingVector,embeddingVector.length,OWNER_PARTITION);

        }catch (Exception e){
            throw new IOException(e.getMessage(), e);
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

    public List<Pet> findKthNearestNeighbors(long ownerId, double[] userWeights, int k) throws Exception{
        try {

           /* List<Pet> allPets = petService.getAllPets();
            Pet petToInject = new Pet();

            int injectValue = (int)(Math.random() * 3);
            boolean inject =  injectValue == 0;
            System.out.println("Inject Value: " + injectValue);

            if(inject){
                //Inject random values for variability
                Random rand = new Random();
                int size = allPets.size();
                petToInject = allPets.get(rand.nextInt() % size);
                System.out.println("Injecting pet: " + petToInject.getPetName());
            }
            if (allPets.isEmpty() || userWeights.length < k) {
                return allPets;
            }

            Map<Long, Double> allPetsWeights = new HashMap<>();
            List<SeenPets> seenPets = seenPetService.getSeenPets(ownerID);

            if (seenPets.size() >= allPets.size()) {
                //User has seen all pets, restart their seen pets
                seenPetService.resetSeenPets(ownerID);
                seenPets = new ArrayList<>();
            }

            for (Pet pet : allPets) {
                boolean hasBeenSeen = false;
                for (SeenPets seenPet : seenPets) {
                    hasBeenSeen = seenPet.getSeenPetId() == pet.getPetId();
                    if (hasBeenSeen) {
                        break;
                    }
                }
                if (!hasBeenSeen) {
                    PetWeights petWeights = petService.getPetWeights(pet);
                    Long petID = pet.getPetId();
                    Preference petStats = new Preference();
                    petStats.setPreferredSpecies(pet.getSpecies());
                    petStats.setPreferredBreed(pet.getBreed());
                    petStats.setPreferredColor(pet.getColor());
                    petStats.setPreferredAge(pet.getAge());
                    allPetsWeights.put(petID, VectorUtils.cosineSimilarity(userWeights, petWeights.getAllWeights()));
                }
            }

            List<Long> kMatchedPets = allPetsWeights.entrySet().stream()
                    .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
                    .limit(k).map(Map.Entry::getKey).toList();


            List<Pet> matchedPets = new ArrayList<>();
            kMatchedPets.stream().forEach(x -> matchedPets.add(petService.getPetById(x).get()));
            if(inject){
                matchedPets.set(matchedPets.size() - 1, petToInject);
            }

            //Add three new pets to the list of seen pets
            */

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
}
