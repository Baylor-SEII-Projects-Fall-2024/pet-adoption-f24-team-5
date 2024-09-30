package petadoption.api.user;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.OwnerRepository;

import java.util.List;

@Configuration
public class UserConfig {
    @Bean
    CommandLineRunner commandLineRunner(UserRepository userRepository, CenterWorkerRepository centerWorkerRepository, OwnerRepository ownerRepository) {
        return args -> {
            User user1 = new User(
                    "peter727@gmail.com",
                    "password",
                    UserType.ClinicOwner,
                    20,
                    "914-282-8870"
            );

            User user2 = new User(
                    "ben@gmail.com",
                    "password2",
                    UserType.ClinicWorker,
                    21,
                    "631-889-5214"
            );

            User user3 = new User(
                    "Jackson@gmail.com",
                    "password3",
                    UserType.PetOwner,
                    21,
                    "254-556-7794"
            );

            userRepository.saveAll(List.of(user1,user2, user3));
        };
    }
}
