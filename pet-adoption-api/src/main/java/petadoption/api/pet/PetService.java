package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.Owner.Owner;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;

    public List<Pet> getAdoptablePets() {
        return petRepository.findByAdoptionStatusFalse().orElse(null);
    }

    public List<Pet> getAllPets() { return petRepository.findAll(); }

    public Pet savePet(Pet pet, AdoptionCenter adoptionCenter) {
        if(adoptionCenter == null) {
            throw new IllegalArgumentException("Adoption center is null");
        }
        pet.setAdoptionCenter(adoptionCenter);
        return petRepository.save(pet);

    }

    public Pet adoptPet(Pet pet, AdoptionCenter adoptionCenter) {
        pet.setAdoptionCenter(adoptionCenter);
        pet.setAdoptionStatus(true);
        return petRepository.save(pet);
    }

    public List<Pet> getPetByAdoptionCenter(AdoptionCenter adoptionCenter) {
        return petRepository.findByAdoptionCenter(adoptionCenter)
                .orElse(null);
    }

    public Integer getNumAvailablePetsByAdoptionCenter(AdoptionCenter adoptionCenter) {
        return petRepository.findNumAvailablePetsByAdoptionCenter(adoptionCenter.getId())
                .orElse(null);
    }

    public void deletePet(Pet pet) {
        if(pet == null) {
            throw new IllegalArgumentException("Pet is null");
        }

        petRepository.delete(pet);
    }

    public Optional<Pet> getPetById(long id) {
        return petRepository.findByPetId(id);
    }

    public long numberOfPets() {
        return petRepository.count();
    }

    public List<String> distinctSpecies() {
        return petRepository.findDistinctSpecies();
    }

    public Pet findRandomPetBySpecies(String species) {
        return petRepository.findRandomPetBySpecies(species);
    }


}
