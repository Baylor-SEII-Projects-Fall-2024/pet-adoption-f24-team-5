package petadoption.api.preferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PreferenceWeightsRepository extends JpaRepository<PreferenceWeights, Long> {
}
