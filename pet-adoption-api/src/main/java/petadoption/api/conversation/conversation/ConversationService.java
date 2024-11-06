package petadoption.api.conversation.conversation;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import java.sql.SQLException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static java.sql.Types.NULL;
import static java.util.Optional.*;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;

    private final PasswordEncoder passwordEncoder;


    public Boolean startConversation(Long petOwnerID, Long centerID)
    {
        // make sure conversation doesn't already exist
        Optional<Conversation> conversation = conversationRepository.findByOwnerIdAndCenterId(petOwnerID,centerID);
        if (conversation.isPresent())
        {
            return false;
        }

        // Create conversation
        Conversation newConversation = new Conversation(petOwnerID,centerID);
        conversationRepository.save(newConversation);
        return true;
    }

    public List<Conversation> findAllConversations(long userID) throws SQLException
    {
        // Make sure valid
        if (userID < 1) {
            throw new IllegalArgumentException("id must be positive");
        }
        List<Conversation> responce = conversationRepository.findAllByUserId(userID);

        if (!responce.isEmpty())
        {
            return responce;
        }

        return Collections.emptyList();
    }
}
