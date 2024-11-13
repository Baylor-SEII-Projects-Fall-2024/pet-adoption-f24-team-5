package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.Collection;
import java.util.List;
import java.util.Optional;


public interface PetRepository extends JpaRepository<Pet, Integer> {
    Optional<List<Pet>> findByAdoptionCenter(AdoptionCenter adoptionCenter);

    Optional<Pet> findByPetId(long petId);

    Optional<List<Pet>> findByPetIdIn(Collection<Long> ids);
}
