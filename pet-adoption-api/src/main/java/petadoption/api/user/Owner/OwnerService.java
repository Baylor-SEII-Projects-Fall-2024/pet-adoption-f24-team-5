package petadoption.api.user.Owner;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeights;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OwnerService {
    private final OwnerRepository ownerRepository;


    public Long getPreferenceWeightsIdByOwnerID(Long id) {
        Optional<Owner> ownerOptional = ownerRepository.findById(id);
        if (ownerOptional.isPresent()) {
            PreferenceWeights pref =  ownerOptional.get().getPreferenceWeights();
            return pref == null ? null : pref.getPreferenceWeightId();
        }
        return null;

    }

    //True if save properly, false if no user is under that ID
    public boolean savePreferenceWeights(long id, PreferenceWeights preference) {
        Optional<Owner> ownerOptional = ownerRepository.findById(id);
        if (ownerOptional.isPresent()) {
            Owner owner = ownerOptional.get();
            owner.setPreferenceWeights(preference);
            ownerRepository.save(owner);
            return true;
        }

        return false;
    }

    public boolean saveDefaultPreferences(long id, Preference preference) {
        Optional<Owner> ownerOptional = ownerRepository.findById(id);
        if (ownerOptional.isPresent()) {
            Owner owner = ownerOptional.get();
            owner.setDefaultPreference(preference);
            ownerRepository.save(owner);
            return true;
        }

        return false;
    }
}
