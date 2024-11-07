package petadoption.api.user.Owner;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

//    @Query("SELECT cw.centerID FROM CenterWorker cw WHERE cw.emailAddress = :email")
    Optional<Owner> findAllById(long id);
}
