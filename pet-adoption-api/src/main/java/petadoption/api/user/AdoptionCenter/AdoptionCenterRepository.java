package petadoption.api.user.AdoptionCenter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;

@Repository
public interface AdoptionCenterRepository extends JpaRepository<AdoptionCenter, Long> {
}
