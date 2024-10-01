package petadoption.api.user.AdoptionCenter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

@Repository
public interface CenterWorkerRepository extends JpaRepository<CenterWorker, Long> {

}
