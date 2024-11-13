package petadoption.api.conversation.message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.conversation.conversation.Conversation;
import petadoption.api.conversation.conversation.ConversationController;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@RequestMapping("/api/message")
@RestController
public class MessageController {
    @Autowired
    private final MessageService messageService;

    @Autowired
    private final ConversationController conversationController;

    public MessageController(MessageService messageService, ConversationController conversationController) {
        this.messageService = messageService;
        this.conversationController = conversationController;
    }


    @PostMapping("/getMessages")
    public ResponseEntity<List<Message>> getMessages(@RequestParam long conversationId, @RequestParam long userId) throws SQLException
    {
        try {
            List<Message> returnMe;
            returnMe = messageService.findAllMessages(conversationId);

            // Update the conversation with read messages
            if (isSenderCenter(userId)) {
                System.out.println("9 is a Center's Id");
                conversationController.resetUnreadMessagesCenter(conversationId);
            } else {
                conversationController.resetUnreadMessagesOwner(conversationId);
            }


            return new ResponseEntity<>(returnMe, HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/sendMessage")
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        try {
            // Send the message using the service
            Message newMessage = this.messageService.sendMessage(message);

            // Check if the message was successfully sent
            if (newMessage == null) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Update the conversation with unread message
            if (isSenderCenter(message.getSenderId())) {
                this.conversationController.addUnreadMessageOwner(message.getConversationId());
            } else {
                this.conversationController.addUnreadMessageCenter(message.getConversationId());
            }

            // Return the created message
            return new ResponseEntity<>(newMessage, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private boolean isSenderCenter(Long senderId) throws SQLException {
        try {
            return conversationController.isCenter(senderId);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }




}
