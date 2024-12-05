package petadoption.api.user.Owner;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeenPetService {

    private final SeenPetsRepository savedPetsRepository;

    public List<SeenPets> addSeenPets(Long ownerId, List<Pet> seenPets){
        List<SeenPets> seenPetsList = new ArrayList<>();
        for (Pet pet : seenPets) {
            SeenPets seenPet = new SeenPets();
            seenPet.setSeenPetId(pet.getPetId());
            seenPet.setOwnerId(ownerId);
            seenPetsList.add(savedPetsRepository.save(seenPet));
        }
        return seenPetsList;
    }

    public List<Long> getSeenPets(Long ownerId){
        List<Long> seenPetsList = savedPetsRepository.findSeenPetIdsByOwnerId(ownerId);
        if(seenPetsList == null || seenPetsList.isEmpty()){
            return new ArrayList<>();
        }
        return seenPetsList;
    }
    @Transactional
    public void resetSeenPets(Long ownerID) {
        savedPetsRepository.deleteAllByOwnerId(ownerID);
    }
}
