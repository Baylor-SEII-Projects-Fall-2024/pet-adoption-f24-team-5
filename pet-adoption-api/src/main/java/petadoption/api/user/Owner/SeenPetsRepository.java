package petadoption.api.user.Owner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeenPetsRepository extends JpaRepository<SeenPets, Long> {

    List<SeenPets> findByOwnerId(Long id);


    void deleteAllByOwnerId(Long id);
}
