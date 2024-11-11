package petadoption.api.preferences;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.user.Owner.OwnerService;
import petadoption.api.user.UserService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PreferenceService {
    private final PreferenceRepository preferenceRepository;
    private final OwnerService ownerService;


    public Optional<Preference> getPreference(long id) {
        return preferenceRepository.findById(id);
    }

    public Preference createPreference(long id, Preference preference) {

        Preference savedPref =  preferenceRepository.save(preference);
        ownerService.saveDefaultPreferences(id, savedPref);
        return savedPref;
    }

    public Preference updatePreference(long id, Preference preference) {
        preference.setPreferenceId(id);
        return preferenceRepository.save(preference);
    }
}
