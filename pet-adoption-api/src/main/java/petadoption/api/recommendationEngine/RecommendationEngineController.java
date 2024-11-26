package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.milvus.MilvusService;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeightsService;
import petadoption.api.user.Owner.OwnerService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/recommendation-engine")
@RequiredArgsConstructor
public class RecommendationEngineController {
/*    INDArray userPreference = word2Vec.getWordVectorMatrix("dog")
            .add(word2Vec.getWordVectorMatrix("Labrador"))
            .add(word2Vec.getWordVectorMatrix("young"))
            .add(word2Vec.getWordVectorMatrix("black"))
            .div(4); // Average out the vectors*/
    private final PetService petService;
    private final RecommendationService recommendationService;
    private final OwnerService ownerService;
    private final MilvusService milvusService;

    @PostMapping("/update-preference")
    public ResponseEntity<?> updatePreference(@RequestParam String email, @RequestBody Preference preference) {
        try{

            List<String> cleanedPreferences = new ArrayList<>();
            cleanedPreferences.add(preference.getPreferredSpecies().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredBreed().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredColor().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(String.valueOf(preference.getPreferredAge()).toLowerCase().replaceAll("\\s+", ""));
            double[] usersNewWeights = recommendationService.savePreferenceEmbedding(ownerService.findOwnerIdByEmail(email)
                    , cleanedPreferences);
            return new ResponseEntity<>(usersNewWeights, HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/generate-new-options")
    public ResponseEntity<?> getNewPets(@RequestParam String email) {
        try{
            Long ownerId = ownerService.findOwnerIdByEmail(email);
//            Long userWeightID = ownerService.getPreferenceWeightsIdByOwnerID(id);

            double[] userWeights = milvusService.getData(ownerId, recommendationService.OWNER_PARTITION);

            if(userWeights != null){

                //TODO: update cold start to store with owner instead.
                //should be done

//                int coldStartValue = recommendationService.getColdStartValue(id);
                int coldStartValue = ownerService.getColdStartValue(ownerId).get();
//                double[] usersNewWeights = recommendationService.getUsersWeights(userWeightID);*/


                // If the user's cold start is over give them valid recommendations
                //TODO: figure out a good injection method.
                if(coldStartValue == 0){
                    return new ResponseEntity<>(recommendationService.findKthNearestNeighbors(ownerId, userWeights, 3)
                            ,HttpStatus.OK);
                }

                // Cold Start is not over -> Give them 3 random pets
                coldStartValue--;
//                recommendationService.setColdStartValue(id, coldStartValue);
                ownerService.setColdStartValue(ownerId, coldStartValue);
            }
            List<Pet> allPets = petService.getAllPets();
            if(allPets.size() <= 3 ){
                return new ResponseEntity<>(allPets, HttpStatus.OK);
            }
            Collections.shuffle(allPets);
            return new ResponseEntity<>(allPets.subList(0,3), HttpStatus.OK);

        }catch (IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }

   /* @PostMapping("/test-preference")
    public ResponseEntity<?> updatePreference(@RequestBody String[] inputPreferences) {
        List<String> pref1 = new ArrayList<>(Arrays.asList("dog", "goldenretriever", "brown", "10"));
        List<String> pref2 = new ArrayList<>(Arrays.asList(inputPreferences));

        try{
            double[] vector1 = recommendationService.savePreferenceEmbedding(3L, pref1);
            double[] vector2 = recommendationService.savePreferenceEmbedding(5L, pref2);

            return new ResponseEntity<>(VectorUtils.cosineSimilarity(vector1, vector2), HttpStatus.OK);

        }catch(Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }*/



}
