package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.List;
import java.util.Optional;


public interface PetRepository extends JpaRepository<Pet, Integer> {
    Optional<List<Pet>> findByAdoptionCenter(AdoptionCenter adoptionCenter);

    @Query("SELECT * FROM pets p WHERE p.center_id = :center_id AND p.adoption_status = false")
    Optional<List<Pet>> findAvailablePetsByAdoptionCenter(@Param("center_id") Long adoptionCenterId);

    Optional<Pet> findByPetId(long petId);
}
