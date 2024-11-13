package petadoption.api.conversation.message;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.auth.AuthenticationController;

@Configuration
public class MessageConfig {
    @Bean
    CommandLineRunner commandLineRunner3(AuthenticationController authenticationController, MessageRepository messageRepository) {
        return args -> {
            Message message = new Message(
                    1L,
                    1L,
                    1L,
                    "This is a test message"
            );
            messageRepository.save(message);

            authenticationController.createMessage(message);
        };
    }
}
