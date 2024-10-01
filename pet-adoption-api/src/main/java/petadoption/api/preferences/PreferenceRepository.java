package petadoption.api.preferences;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;

@Repository
public interface PreferenceRepository extends JpaRepository<Preference, Long> {
}
