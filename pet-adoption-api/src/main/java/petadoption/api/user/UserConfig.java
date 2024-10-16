package petadoption.api.user;

import jakarta.websocket.OnClose;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.auth.AuthenticationController;
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
    CommandLineRunner commandLineRunner(AuthenticationController authenticationController, CenterWorkerRepository centerWorkerRepository, OwnerRepository ownerRepository, AdoptionCenterRepository adoptionCenterRepository, UserRepository userRepository) {
        return args -> {
            CenterWorker user1 = new CenterWorker(
                    "peter727@gmail.com",
                    "password",
                    UserType.CenterWorker,
                    20,
                    "914-282-8870",
                    1L
            );

            CenterWorker user2 = new CenterWorker(
                    "ben@gmail.com",
                    "password2",
                    UserType.CenterWorker,
                    21,
                    "631-889-5214",
                    1L
            );

            Owner user3 = new Owner(
                    "Jackson@gmail.com",
                    "password3",
                    UserType.Owner,
                    21,
                    "254-556-7794"
            );

            AdoptionCenter adoptionCenter1 = new AdoptionCenter(
                    "Andrew@gmail.com",
                    "password4",
                    UserType.CenterOwner,
                    "254-556-7794",
                    "Peter's Adoption Clinic",
                    "1608 James Avenue",
                    "Waco",
                    "Texas",
                    "76706",
                    128
            );

            authenticationController.register(user1);
            authenticationController.register(user2);
            authenticationController.register(user3);
            authenticationController.register(adoptionCenter1);


            userService.initialize();


        };
    }
}
