package petadoption.api.user.AdoptionCenter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.Optional;

@Repository
public interface CenterWorkerRepository extends JpaRepository<CenterWorker, Long> {
        Optional<Long> findCenterIdById(Long id);

        @Query("SELECT cw.centerID FROM CenterWorker cw WHERE cw.emailAddress = :email")
        Optional<Long> findCenterIdByEmailAddress(@Param("email") String email);
}
