package petadoption.api.conversation.message;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    private final PasswordEncoder passwordEncoder;

    public List<Message> findAllMessages(long conversationId) throws SQLException
    {
        // make sure valid
        if (conversationId < 1) {
            throw new IllegalArgumentException("id must be positive");
        }
        try
        {
            List<Message> responce = messageRepository.findByConversationId(conversationId);
            if (!responce.isEmpty())
            {
                return responce;
            }
            return Collections.emptyList();
        }
        catch (Exception e) {
            e.printStackTrace(); // Log the exception
            throw e; // Rethrow to be caught by the controller
        }
    }

    public Message sendMessage(Message message)
    {
        try
        {
            message.setDate(LocalDateTime.now()); // Set the date on the server
            return this.messageRepository.save(message);
        }
        catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }





}
