package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import petadoption.api.Event.Event;
import petadoption.api.preferences.Preference;
//import petadoption.api.recommendationEngine.RecommendationService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.User;

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

    public void adoptPet(Pet pet, Owner owner) {
        petRepository.findByPetId(pet.getPetId()).map(tempPet -> {
            tempPet.setAdoptionStatus(true);
            tempPet.setPetOwner(owner);
            tempPet.setOwner(owner);
            Pet savedPet = petRepository.save(tempPet);
            return ResponseEntity.ok(savedPet);
        }).orElseGet(() -> ResponseEntity.notFound().build());
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
