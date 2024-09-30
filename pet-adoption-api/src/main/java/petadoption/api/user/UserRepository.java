package petadoption.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@NoRepositoryBean
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailAddressAndPassword(String email, String password);
    Optional<User> findByEmailAddress(String email);
}
