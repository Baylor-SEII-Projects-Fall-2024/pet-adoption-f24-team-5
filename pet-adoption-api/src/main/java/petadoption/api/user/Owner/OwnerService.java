package petadoption.api.user.Owner;

import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;
import petadoption.api.preferences.Preference;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OwnerService {
    private final OwnerRepository ownerRepository;


    public Long getPreferenceIdByOwnerID(Long id) {
        Optional<Owner> ownerOptional = ownerRepository.findById(id);
        if (ownerOptional.isPresent()) {
            Preference pref =  ownerOptional.get().getPreference();
            return pref == null ? null : pref.getPreferenceId();
        }
        return null;

    }

    //True if save properly, false if no user is under that ID
    public boolean savePreference(long id, Preference preference) {
        Optional<Owner> ownerOptional = ownerRepository.findById(id);
        if (ownerOptional.isPresent()) {
            Owner owner = ownerOptional.get();
            owner.setPreference(preference);
            ownerRepository.save(owner);
            return true;
        }

        return false;
    }
}
