package petadoption.api.user;

import jakarta.websocket.OnClose;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.UserRepository;

import java.util.List;

import static petadoption.api.user.UserType.CenterOwner;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner commandLineRunner(UserService userService) {
        return args -> {

            userService.initialize();


        };
    }
}
