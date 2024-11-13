package petadoption.api.conversation.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByOwnerIdAndCenterId(Long ownerId, Long centerId);

    Optional<Conversation> findById(Long Id);


    @Query("SELECT c FROM Conversation c WHERE c.centerId = :id OR c.ownerId = :id")
    List<Conversation> findAllByUserId(@Param("id") Long id);


    @Modifying
    @Query("UPDATE Conversation c SET c.unreadMessagesCenter = c.unreadMessagesCenter + 1 WHERE c.conversationId = :conversationId")
    void incrementUnreadMessagesCenter(@Param("conversationId") Long conversationId);

    @Modifying
    @Query("UPDATE Conversation c SET c.unreadMessagesOwner = c.unreadMessagesOwner + 1 WHERE c.conversationId = :conversationId")
    void incrementUnreadMessagesOwner(@Param("conversationId") Long conversationId);

    @Modifying
    @Query("UPDATE Conversation c SET c.unreadMessagesCenter = 0 WHERE c.conversationId = :conversationId")
    void resetUnreadMessagesCenter(@Param("conversationId") Long conversationId);

    @Modifying
    @Query("UPDATE Conversation c SET c.unreadMessagesOwner = 0 WHERE c.conversationId = :conversationId")
    void resetUnreadMessagesOwner(@Param("conversationId") Long conversationId);


    boolean existsByCenterId(Long centerId);

}
