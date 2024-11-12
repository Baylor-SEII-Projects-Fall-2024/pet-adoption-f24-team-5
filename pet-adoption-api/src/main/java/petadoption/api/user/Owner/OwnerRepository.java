package petadoption.api.user.Owner;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {

<<<<<<< HEAD
    Optional<Owner> findByEmailAddress(String emailAddress);
=======
    Optional<Owner> findAllById(long id);
>>>>>>> ff373c71d3c3a86f9c8b175d1e40d62ac4d3fbb8
}
