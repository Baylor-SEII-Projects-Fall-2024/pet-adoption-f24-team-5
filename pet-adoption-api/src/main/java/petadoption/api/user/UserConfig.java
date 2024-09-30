package petadoption.api.user;

import jakarta.websocket.OnClose;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
    CommandLineRunner commandLineRunner(CenterWorkerRepository centerWorkerRepository, OwnerRepository ownerRepository) {
        return args -> {
            CenterWorker user1 = new CenterWorker(
                    "peter727@gmail.com",
                    "password",
                    CenterOwner,
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

            centerWorkerRepository.saveAll(List.of(user1,user2));
            ownerRepository.saveAll(List.of(user3));

        };
    }
}
