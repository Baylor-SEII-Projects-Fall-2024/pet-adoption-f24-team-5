package petadoption.api.conversation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.conversation.Conversation;
import petadoption.api.conversation.ConversationService;
import petadoption.api.conversation.ConversationRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RequestMapping("/api/conversation")
@RestController
public class ConversationController {
    @Autowired
    private final ConversationService conversationService;

    public ConversationController(ConversationService conversationService) {
        this.conversationService = conversationService;
    }
}
