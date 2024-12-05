package petadoption.api.conversation.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import petadoption.api.conversation.conversation.Conversation;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    Optional<Message> findByConversationIdAndSenderIdAndReceiverId(Long conversationId, Long senderId, Long receiverId);

    Optional<Message> findById(Long Id);

    @Query("SELECT m FROM Message m WHERE m.conversationId =:id")
    List<Message> findByConversationId(@Param("id") Long id);

}
