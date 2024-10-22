package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.amqp.RabbitConnectionDetails;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    @Autowired
    private PetRepository petRepository;

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
        } else if (pet.getPetId() == null) {
            throw new IllegalArgumentException("Pet id is null");
        }

        petRepository.delete(pet);
    }


}
