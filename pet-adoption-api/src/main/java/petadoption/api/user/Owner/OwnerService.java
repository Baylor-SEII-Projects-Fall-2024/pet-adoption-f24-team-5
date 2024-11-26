package petadoption.api.user.Owner;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import petadoption.api.pet.PetRepository;
import petadoption.api.preferences.Preference;
//import petadoption.api.preferences.PreferenceWeights;


@Service
@RequiredArgsConstructor
public class OwnerService {
    
    private final OwnerRepository ownerRepository;
    private final PetRepository petRepository;


    public Optional<List<Pet>> getAllSavedPetsByEmail(String email) {
        Owner owner = ownerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email address: " + email));

        return petRepository.findByPetIdIn(owner.getSavedPets())
                .filter(pets -> !pets.isEmpty()).or(() -> Optional.of(Collections.emptyList()));
    }

    @Transactional
    public void savePetForOwnerByEmail(String email, Pet pet) {
        Owner owner = ownerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        petRepository.findByPetId(pet.getPetId())
                .orElseThrow(() -> new RuntimeException("Pet not found"));

        owner.getSavedPets().add(pet.getPetId());

        ownerRepository.save(owner);

    }

    @Transactional
    public void removeSavedPetForOwnerByEmail(String email, Pet pet) {
        Owner owner = ownerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        owner.getSavedPets().remove(pet.getPetId());

        ownerRepository.save(owner);
    }

//    public Long getPreferenceWeightsIdByOwnerID(Long id) {
//        Optional<Owner> ownerOptional = ownerRepository.findById(id);
//        if (ownerOptional.isPresent()) {
//            PreferenceWeights pref =  ownerOptional.get().getPreferenceWeights();
//            return pref == null ? null : pref.getPreferenceWeightId();
//        }
//        return null;
//
//    }

    //True if save properly, false if no user is under that ID
//    public boolean savePreferenceWeights(long id, PreferenceWeights preference) {
//        Optional<Owner> ownerOptional = ownerRepository.findById(id);
//        if (ownerOptional.isPresent()) {
//            Owner owner = ownerOptional.get();
//            owner.setPreferenceWeights(preference);
//            ownerRepository.save(owner);
//            return true;
//        }
//
//        return false;
//    }

    public Optional<Integer> getColdStartValue(long id) {
        Optional<Owner> owner = ownerRepository.findById(id);
        if(owner.isPresent()) {
            return Optional.of(owner.get().getColdStartValue());
        }
        throw new RuntimeException("Owner not found");
    }

    public int setColdStartValue(long id, int value) {
        Optional<Owner> owner = ownerRepository.findById(id);
        if(owner.isPresent()) {
            owner.get().setColdStartValue(value);
            return ownerRepository.save(owner.get()).getColdStartValue();
        }
        throw new RuntimeException("Owner not found");
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

    public Long findOwnerIdByEmail(String email) {
        Owner owner = ownerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        return owner.getId();
    }
}
