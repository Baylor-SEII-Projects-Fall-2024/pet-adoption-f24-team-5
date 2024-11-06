package petadoption.api.conversation.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.conversation.conversation.Conversation;

import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/api/message")
@RestController
public class MessageController {
    @Autowired
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }


    @PostMapping("/getMessages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam long conversationId)
    {
        try {
            List<Message> returnMe;
            returnMe = messageService.findAllMessages(conversationId);
            return new ResponseEntity<>(returnMe, HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/sendMessage")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message)
    {
        try {
            Message newMessage = this.messageService.sendMessage(message);
            if (newMessage == null) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Return the created message
            return new ResponseEntity<>(newMessage, HttpStatus.OK);
        }
        catch(Exception e){
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
