package petadoption.api.recommendationEngine;

import io.milvus.v2.client.MilvusClientV2;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
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
@ConditionalOnBean(MilvusServiceAdapter.class)
public class RecommendationEngineController {

    private final PetService petService;
    private final RecommendationService recommendationService;
    private final OwnerService ownerService;
    private final MilvusServiceAdapter milvusServiceAdapter;

    @PostMapping("/skew-results")
    public ResponseEntity<?> skewResults(@RequestParam String species, @RequestParam String email) {
        String breed = "any";
        String color = "multicolor";
        int age = 4;

        try {
            List<String> cleanedPreferences = new ArrayList<>();
            cleanedPreferences.add(species.toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(breed.toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(color.toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(String.valueOf(age).toLowerCase().replaceAll("\\s+", ""));

            double[] userNewWeights = recommendationService.savePreferenceEmbedding(ownerService.findOwnerIdByEmail(email), cleanedPreferences, 3.0);
            return new ResponseEntity<>(userNewWeights, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/update-preference")
    public ResponseEntity<?> updatePreference(@RequestParam String email, @RequestBody Preference preference) {
        try{
            long ownerId = ownerService.findOwnerIdByEmail(email);
            List<String> cleanedPreferences = new ArrayList<>();
            cleanedPreferences.add(preference.getPreferredSpecies().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredBreed().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredColor().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(String.valueOf(preference.getPreferredAge()).toLowerCase().replaceAll("\\s+", ""));

            double[] usersNewWeights = recommendationService.savePreferenceEmbedding(ownerId, cleanedPreferences, ownerService.getColdStartValue(ownerId).get());

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

            int coldStartValue = ownerService.getColdStartValue(ownerId).get();
            if(userWeights != null){

                ownerService.setColdStartValue(ownerId, coldStartValue-1);

                if(coldStartValue <= 0){
                    return new ResponseEntity<>(recommendationService.findKthNearestNeighbors(ownerId, userWeights, 3)
                            ,HttpStatus.OK);
                }

            }
            List<Pet> allPets = recommendationService.coldStart(coldStartValue);
            return new ResponseEntity<>(allPets.subList(0,3), HttpStatus.OK);

        }catch (IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.I_AM_A_TEAPOT);
        }
    }

    @PostMapping("/reset-engine")
    public ResponseEntity<?> resetEngine(@RequestParam String email) {
        try {
            long ownerId = ownerService.findOwnerIdByEmail(email);

            milvusServiceAdapter.deleteData(ownerId, recommendationService.OWNER_PARTITION);

            ownerService.setColdStartValue(ownerId, 3);

            return new ResponseEntity<>("Reset Successful", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }



}
