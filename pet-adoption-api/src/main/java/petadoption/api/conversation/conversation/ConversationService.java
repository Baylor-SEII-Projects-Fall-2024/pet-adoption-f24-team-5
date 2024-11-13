package petadoption.api.conversation.conversation;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    @Transactional
    public void addUnreadMessageCenter(Long conversationId) throws SQLException{
        // make sure valid id
        if(conversationId < 1)
        {
            throw new IllegalArgumentException("Id must be positive");
        }
        try {
            conversationRepository.incrementUnreadMessagesCenter(conversationId);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void addUnreadMessageOwner(Long conversationId) throws SQLException {
        // Ensure the ID is valid
        if (conversationId < 1) {
            throw new IllegalArgumentException("Id must be positive");
        }
        try {
            conversationRepository.incrementUnreadMessagesOwner(conversationId);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public boolean isCenter(Long senderId) throws SQLException {
        try {
            // Check if the user is associated with a center (adjust logic based on your requirements)
            return conversationRepository.existsByCenterId(senderId);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            throw new SQLException("Error checking if sender is a center", e);
        }
    }

    @Transactional
    public void resetUnreadMessagesCenter(Long conversationId) throws SQLException {
        if (conversationId < 1) {
            throw new IllegalArgumentException("Id must be positive");
        }
        if (!conversationRepository.existsById(conversationId)) {
            throw new EntityNotFoundException("Conversation not found with ID: " + conversationId);
        }
        conversationRepository.resetUnreadMessagesCenter(conversationId);
    }


    @Transactional
    public void resetUnreadMessagesOwner(Long conversationId) throws SQLException {
        if (conversationId < 1) {
            throw new IllegalArgumentException("Id must be positive");
        }
        try {
            conversationRepository.resetUnreadMessagesOwner(conversationId);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public List<Conversation> getAllUnreadForUser(long userId) throws SQLException {
        if (userId < 1) {
            throw new IllegalArgumentException("User ID must be positive");
        }
        try {
            return conversationRepository.findUnreadByUserId(userId);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow the exception to be handled by the controller
        }
    }



    public String getOwnerNameByConversationId(long conversationId) {
        // Call repository method to fetch owner name
        return conversationRepository.findOwnerNameByConversationId(conversationId);
    }

    public String getCenterNameByConversationId(long conversationId) {
        // Call repository method to fetch center name
        return conversationRepository.findCenterNameByConversationId(conversationId);
    }
}
