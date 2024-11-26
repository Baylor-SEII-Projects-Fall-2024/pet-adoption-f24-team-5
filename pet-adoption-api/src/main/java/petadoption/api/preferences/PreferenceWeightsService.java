/*
package petadoption.api.preferences;

import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PreferenceWeightsService {

    private final PreferenceWeightsRepository preferenceRepository;

    */
/*public Preference getPreferences(Long preferenceId) {
        return preferenceRepository.findById(preferenceId).orElse(null);
    }

    public Preference createPreference(Preference newPreference) {
        return preferenceRepository.save(newPreference);
    }

    public Preference updatePreferences(Long preferenceId, Preference newPreferences) {
        Preference existingPreferences = preferenceRepository.findById(preferenceId).orElse(null);
        if (existingPreferences != null) {
            existingPreferences.setPreferredSpecies(newPreferences.getPreferredSpecies());
            existingPreferences.setPreferredBreed(newPreferences.getPreferredBreed());
            existingPreferences.setPreferredColor(newPreferences.getPreferredColor());
            existingPreferences.setPreferredAge(newPreferences.getPreferredAge());
            return preferenceRepository.save(existingPreferences);
        }
        return null;
    }*//*


    public PreferenceWeights getPreferenceWeights(Long id) {
        return preferenceRepository.findById(id).orElse(null);
    }

    public PreferenceWeights savePreferenceWeights(PreferenceWeights preferenceWeights) {
        return preferenceRepository.save(preferenceWeights);
    }

    public PreferenceWeights updatePreferenceWeights(Long id, PreferenceWeights preferenceWeights) {
        PreferenceWeights existingPreference = preferenceRepository.findById(id).orElse(null);
        if (existingPreference != null) {
            preferenceWeights.setPreferenceWeightId(id);
            return preferenceRepository.save(preferenceWeights);
        }
        return null;
    }

    public Optional<Integer> getColdStartValue(long preferenceWeightId) {
        Optional<PreferenceWeights> preferenceWeights = preferenceRepository.findById(preferenceWeightId);
        if (preferenceWeights.isPresent()) {
            return Optional.of(preferenceWeights.get().getColdStartValue());
        }
        return Optional.empty();
    }

    public int setColdStartValue(long id, int coldStartValue) {
        PreferenceWeights preferenceWeights = getPreferenceWeights(id);
        preferenceWeights.setColdStartValue(coldStartValue);
        return preferenceRepository.save(preferenceWeights).getColdStartValue();
    }
}
*/
