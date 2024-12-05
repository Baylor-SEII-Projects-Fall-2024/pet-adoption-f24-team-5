package petadoption.api.user.Owner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeenPetsRepository extends JpaRepository<SeenPets, Long> {

    List<SeenPets> findByOwnerId(Long id);

    @Query("SELECT sp.seenPetId FROM SeenPets sp WHERE sp.ownerId = :ownerId")
    List<Long> findSeenPetIdsByOwnerId(@Param("ownerId") Long ownerId);

    void deleteAllByOwnerId(Long id);
}
