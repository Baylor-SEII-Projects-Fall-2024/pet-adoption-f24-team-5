package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.milvus.MilvusServiceAdapter;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetService;
import petadoption.api.preferences.Preference;
import petadoption.api.user.Owner.OwnerService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/recommendation-engine")
@RequiredArgsConstructor
public class RecommendationEngineController {

    private final PetService petService;
    private final RecommendationService recommendationService;
    private final OwnerService ownerService;
    private final MilvusServiceAdapter milvusServiceAdapter;

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

            double[] userWeights = milvusServiceAdapter.getData(ownerId, recommendationService.OWNER_PARTITION);

            if(userWeights != null){

                int coldStartValue = ownerService.getColdStartValue(ownerId).get();

                if(coldStartValue == 0){
                    return new ResponseEntity<>(recommendationService.findKthNearestNeighbors(ownerId, userWeights, 3)
                            ,HttpStatus.OK);
                }

                coldStartValue--;
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
