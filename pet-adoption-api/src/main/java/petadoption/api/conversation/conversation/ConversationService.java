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


    public Conversation startConversation(long petOwnerID, long centerID) {
        try {
            // Check if a conversation already exists
            Optional<Conversation> existingConversation = conversationRepository.findByOwnerIdAndCenterId(petOwnerID, centerID);
            if (existingConversation.isPresent()) {
                // Return the existing conversation
                return existingConversation.get();
            }

            // Create and save a new conversation
            Conversation conversation = new Conversation();
            conversation.setOwnerId(petOwnerID);
            conversation.setCenterId(centerID);
            return conversationRepository.save(conversation);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }




    public List<Conversation> findAllConversations(long userID) throws SQLException {
        // Make sure valid
        if (userID < 1) {
            throw new IllegalArgumentException("id must be positive");
        }
        try {
            List<Conversation> response = conversationRepository.findAllByUserId(userID);
            if (!response.isEmpty()) {
                return response;
            }
            return Collections.emptyList();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow to be caught by the controller
        }
    }

}
