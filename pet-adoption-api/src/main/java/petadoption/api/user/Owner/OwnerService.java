package petadoption.api.user.Owner;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import java.util.Optional;
import java.util.Set;
import petadoption.api.preferences.Preference;
import petadoption.api.preferences.PreferenceWeights;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class OwnerService {
    
    private final OwnerRepository ownerRepository;

    public Optional<Set<Pet>> getAllSavedPetsByEmail(String email) {
        Optional<Owner> owner = ownerRepository.findByEmailAddress(email);

        if (owner.isPresent()) {

            Optional<Set<Pet>> pets = Optional.ofNullable(owner.get().getSavedPets());

            //TODO: clean the pet list to remove all pets that have been adopted

            return pets;
        }

        return Optional.empty();
    }

    public void savePetForOwnerByEmail(String email, Pet pet) {
        Owner owner = ownerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        owner.getSavedPets().add(pet);
        pet.getUsersWhoSaved().add(owner);

        ownerRepository.save(owner);

    }

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
