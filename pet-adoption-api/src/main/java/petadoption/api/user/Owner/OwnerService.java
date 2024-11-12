package petadoption.api.user.Owner;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;

import java.util.Optional;
import java.util.Set;

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

}
