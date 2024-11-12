package petadoption.api.pet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PetWeightRepository extends JpaRepository<PetWeights, Long> {

}
