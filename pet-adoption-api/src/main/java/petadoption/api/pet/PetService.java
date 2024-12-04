package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;


    public List<Pet> getAllPets() { return petRepository.findAll(); }

    public Pet savePet(Pet pet, AdoptionCenter adoptionCenter) {
        if(adoptionCenter == null) {
            throw new IllegalArgumentException("Adoption center is null");
        }
        pet.setAdoptionCenter(adoptionCenter);
        return petRepository.save(pet);

    }

    public List<Pet> getPetByAdoptionCenter(AdoptionCenter adoptionCenter) {
        return petRepository.findByAdoptionCenter(adoptionCenter)
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
