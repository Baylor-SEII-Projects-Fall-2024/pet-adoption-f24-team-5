package petadoption.api.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.stereotype.Repository;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByOwnerIdAndCenterId(Long ownerId, Long centerId);

    Optional<Conversation> findById(Long Id);

}
