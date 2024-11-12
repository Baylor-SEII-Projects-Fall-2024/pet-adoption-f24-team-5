package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionDetails;
import org.springframework.stereotype.Service;
import petadoption.api.preferences.Preference;
import petadoption.api.recommendationEngine.RecommendationService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetWeightService petWeightService;


    public List<Pet> getAllPets() { return petRepository.findAll(); }

    public Pet savePet(Pet pet, AdoptionCenter adoptionCenter) {
        if(adoptionCenter == null) {
            throw new IllegalArgumentException("Adoption center is null");
        }
        pet.setAdoptionCenter(adoptionCenter);
        return petRepository.save(pet);

    }

    public Pet savePet(Pet pet, AdoptionCenter adoptionCenter, double[] petVector) {
        if(adoptionCenter == null) {
            throw new IllegalArgumentException("Adoption center is null");
        }
        pet.setAdoptionCenter(adoptionCenter);

        Preference petStats = new Preference();

        petStats.setPreferredSpecies(pet.getSpecies());
        petStats.setPreferredBreed(pet.getBreed());
        petStats.setPreferredColor(pet.getColor());
        petStats.setPreferredAge(pet.getAge());

        long petWeightID = petWeightService.savePet(pet, petVector);
        pet.setPetWeightId(petWeightID);
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




}
