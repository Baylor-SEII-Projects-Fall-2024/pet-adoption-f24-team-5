package petadoption.api.recommendationEngine;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeightsService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
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
    private final AttributeEmbedding attributeEmbedding;
    private final PreferenceWeightsService preferenceWeightsService;
    private final RecommendationService recommendationService;

    @PostMapping("/update-preference/{id}")
    public ResponseEntity<?> updatePreference(@PathVariable long id, @RequestBody Preference preference) {

        try{
            List<String> cleanedPreferences = new ArrayList<>();
            cleanedPreferences.add(preference.getPreferredSpecies().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredBreed().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(preference.getPreferredColor().toLowerCase().replaceAll("\\s+", ""));
            cleanedPreferences.add(String.valueOf(preference.getPreferredAge()).toLowerCase().replaceAll("\\s+", ""));

            return new ResponseEntity<>(recommendationService.savePreferenceEmbedding(id, cleanedPreferences)
                    ,HttpStatus.OK);
        }catch (IOException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/test-preference")
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
    }



}
