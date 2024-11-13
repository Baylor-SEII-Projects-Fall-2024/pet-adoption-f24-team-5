package petadoption.api.conversation.conversation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.auth.AuthenticationResponse;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.UserService;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RequestMapping("/api/conversation")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ConversationController {
    @Autowired
    private final ConversationService conversationService;

    private final UserService userService;

    public ConversationController(ConversationService conversationService, UserService userService) {
        this.conversationService = conversationService;
        this.userService = userService;
    }

    @PostMapping("/startConversation")
    public ResponseEntity<Conversation> startConversation(
            @RequestParam long petOwnerID,
            @RequestParam long centerID) {

        try {
            // Check if the center exists
            Optional<AdoptionCenter> center = userService.findAdoptionCenterById(centerID);
            if (center.isEmpty()) {
                // Return NOT_FOUND if the center does not exist
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Start the conversation
            Conversation conversation = conversationService.startConversation(petOwnerID, centerID);
            if (conversation == null) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Return the existing or new conversation
            return new ResponseEntity<>(conversation, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




    @PostMapping("/getAllConversations")
    public ResponseEntity<List<Conversation>> getAllConversations(@RequestParam long userId) {
        try {
            List<Conversation> returnMe = conversationService.findAllConversations(userId);
            return new ResponseEntity<>(returnMe, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Void> addUnreadMessageCenter(Long conversationId) {
        try {
            conversationService.addUnreadMessageCenter(conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<Void> addUnreadMessageOwner(Long conversationId) {
        try {
            conversationService.addUnreadMessageOwner(conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/reset-center-unread/{conversationId}")
    public ResponseEntity<Void> resetUnreadMessagesCenter(@PathVariable Long conversationId) {
        try {
            conversationService.resetUnreadMessagesCenter(conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/reset-owner-unread/{conversationId}")
    public ResponseEntity<Void> resetUnreadMessagesOwner(@PathVariable Long conversationId) {
        try {
            conversationService.resetUnreadMessagesOwner(conversationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    public boolean isCenter(Long senderId) throws SQLException {
        try {
            return conversationService.isCenter(senderId);
        }
        catch (Exception e)
        {
            e.printStackTrace();
            return false;
        }
    }

}
