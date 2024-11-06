package petadoption.api.conversation.conversation;

import org.springframework.data.jpa.repository.JpaRepository;
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



}
