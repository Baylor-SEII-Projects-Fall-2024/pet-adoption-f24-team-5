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
                    "Peter",
                    "Whitcomb",
                    "peter727@gmail.com",
                    "password",
                    UserType.CenterWorker,
                    20,
                    "914-282-8870",
                    5L
            );

            CenterWorker user2 = new CenterWorker(
                    "Ben",
                    "Szabo",
                    "ben@gmail.com",
                    "password2",
                    UserType.CenterWorker,
                    21,
                    "631-889-5214",
                    5L
            );

            CenterWorker user4 = new CenterWorker(
                    "Work",
                    "Hard",
                    "work@gmail.com",
                    "password",
                    UserType.CenterWorker,
                    43,
                    "770-586-9987",
                    6L
            );

            Owner user3 = new Owner(
                    "Jackson",
                    "Henry",
                    "Jackson@gmail.com",
                    "password3",
                    UserType.Owner,
                    21,
                    "254-556-7794",
                    "14757"
            );

            AdoptionCenter adoptionCenter1 = new AdoptionCenter(
                    4L,
                    "Andrew@gmail.com",
                    "password4",
                    UserType.CenterOwner,
                    "254-556-7794",
                    "Peter's Adoption Clinic",
                    "1608 James Avenue",
                    "Waco",
                    "Texas",
                    "14757",
                    128
            );

            AdoptionCenter adoptionCenter2 = new AdoptionCenter(
                    "owner@example.com",
                    "pass",
                    UserType.CenterOwner,
                    "555-1234-7794",
                    "NY Animal Rescue",
                    "123 Main St",
                    "New York",
                    "NY",
                    "06390",
                    123
            );

            AdoptionCenter adoptionCenter3 = new AdoptionCenter(
                    2L,
                    "adopting@gmail.com",
                    "password",
                    UserType.CenterOwner,
                    "254-556-7794",
                    "Waco Pet Adoption",
                    "1608 Bagby Avenue",
                    "Waco",
                    "Texas",
                    "76706",
                    12
            );

            authenticationController.register(user1);
            authenticationController.register(user2);
            authenticationController.register(user3);
            authenticationController.register(user4);
            authenticationController.register(adoptionCenter1);
            authenticationController.register(adoptionCenter2);
            authenticationController.register(adoptionCenter3);
        };
    }
}
