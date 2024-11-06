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
    public ResponseEntity<AuthenticationResponse> startConversation(long petOwnerID, long centerID) throws SQLException {
        // See if center exists
        Optional<AdoptionCenter> Center;
        try {
            Center = userService.findAdoptionCenterById(centerID);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // Now that we have the center, store a conversation
        if(!this.conversationService.startConversation(petOwnerID,centerID))
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // return ok
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/getAllConversations")
    public ResponseEntity<AuthenticationResponse> getAllConversations(long userId)
    {
        try {
            List<Conversation> returnMe = conversationService.findAllConversations(userId);
            return new ResponseEntity<>(returnMe, HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
