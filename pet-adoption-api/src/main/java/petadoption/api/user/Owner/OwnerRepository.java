package petadoption.api.user.Owner;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
}