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
        pet.setAdoptionCenter(adoptionCenter);
        return petRepository.save(pet);

    }

    public Pet updatePet(Pet pet) {
        if(pet.getPetId() == null) {
            throw new IllegalArgumentException("Pet Id is required to update pet");
        }
        return petRepository.save(pet);
    }

    public List<Pet> getPetByAdoptionCenter(AdoptionCenter adoptionCenter) {
        return petRepository.findByAdoptionCenter(adoptionCenter)
                .orElseThrow(() -> new IllegalArgumentException("Adoption Center is required to find pets"));
    }


}
