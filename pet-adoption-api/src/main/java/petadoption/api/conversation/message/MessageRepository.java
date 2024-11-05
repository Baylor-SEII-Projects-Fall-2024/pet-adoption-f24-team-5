package petadoption.api.conversation.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Optional<Message> findByConversationIdAndSenderIdAndReceiverId(Long conversationId, Long senderId, Long receiverId);

    Optional<Message> findById(Long Id);

}
