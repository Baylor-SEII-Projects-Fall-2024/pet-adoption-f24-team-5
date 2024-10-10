package petadoption.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAddressAndPassword(String email, String password);
    Optional<User> findByEmailAddress(String email);

    // In UserRepository.java
    @Query("SELECT u FROM User u WHERE TYPE(u) = AdoptionCenter")
    List<AdoptionCenter> findAllAdoptionCenters();

}
