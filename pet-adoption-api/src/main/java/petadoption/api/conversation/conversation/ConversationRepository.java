package petadoption.api.conversation.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByOwnerIdAndCenterId(Long ownerId, Long centerId);

    Optional<Conversation> findById(Long Id);

}
