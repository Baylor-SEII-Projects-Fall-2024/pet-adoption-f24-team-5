package petadoption.api.conversation.conversation;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.auth.AuthenticationController;

@Configuration
public class ConversationConfig {
    @Bean
    CommandLineRunner commandLineRunner2(AuthenticationController authenticationController, ConversationRepository conversationRepository) {
        return args -> {
            Conversation conversation = new Conversation(
                    1L,
                    1L
            );
            conversationRepository.save(conversation);

            authenticationController.createConversation(conversation);
        };
    }
}
