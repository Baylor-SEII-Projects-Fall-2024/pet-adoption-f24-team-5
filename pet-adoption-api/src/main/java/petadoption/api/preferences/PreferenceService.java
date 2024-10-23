package petadoption.api.preferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceRepository;

@Service
public class PreferenceService {

    @Autowired
    private PreferenceRepository preferenceRepository;

    public Preference getPreferences(Long preferenceId) {
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
    }
}
