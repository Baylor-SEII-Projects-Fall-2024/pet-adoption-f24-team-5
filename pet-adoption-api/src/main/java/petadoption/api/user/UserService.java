package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import petadoption.api.Event.Event;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;
    @Autowired
    private CenterWorkerRepository centerWorkerRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    /*public User findUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user.get();
    }*/

    public User findUser(String emailAddress) {
        Optional<User> user = userRepository.findByEmailAddress(emailAddress);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user.get();
    }

    public User saveUser(User user) {return userRepository.save(user);}

    public ResponseEntity<User> updateUser(User user, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, findUser(user.getEmailAddress()).getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        User newUser = findUser(user.getEmailAddress());
        newUser.setFirstName(user.getFirstName());
        newUser.setLastName(user.getLastName());
        newUser.setPhoneNumber(user.getPhoneNumber());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        return new ResponseEntity<>(userRepository.save(newUser), HttpStatus.OK);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    // In UserService.java
    public List<AdoptionCenter> findAllAdoptionCenters() {
        return userRepository.findAllAdoptionCenters();
    }


    public User loginUser(String email, String password) throws IllegalArgumentException {
        Optional<User> user = userRepository.findByEmailAddressAndPassword(email, password);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user.get();
    }

    public Long registerUser(Owner account) throws IllegalArgumentException{
        System.out.println("Inside registerUser for owner");
        Optional<User> user = userRepository.findByEmailAddress(account.getEmailAddress());
        if (user.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }
        ownerRepository.save((Owner) account);
        user = userRepository.findByEmailAddress(account.emailAddress);

        if(user.isEmpty()){
            throw new IllegalArgumentException("Error adding user");
        }
        return user.get().getId();
    }

    public Long registerUser(CenterWorker account) throws IllegalArgumentException{

        Optional<User> user = userRepository.findByEmailAddress(account.getEmailAddress());
        if (user.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        centerWorkerRepository.save( account);
        user = userRepository.findByEmailAddress(account.emailAddress);

        if(user.isEmpty()){
            throw new IllegalArgumentException("Error adding user");
        }
        return user.get().getId();
    }

    public Long registerUser(AdoptionCenter account) throws IllegalArgumentException{

        Optional<User> user = userRepository.findByEmailAddress(account.getEmailAddress());
        if (user.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        adoptionCenterRepository.save(account);
        user = userRepository.findByEmailAddress(account.emailAddress);

        if(user.isEmpty()){
            throw new IllegalArgumentException("Error adding user");
        }
        return user.get().getId();
    }


    public void initialize() {
        // Check if the email address exists before inserting
        try {
            if (userRepository.findByEmailAddress("peter727@gmail.com").isEmpty()) {
                CenterWorker user1 = new CenterWorker(
                        "Peter",
                        "Whitcomb",
                        "peter727@gmail.com",
                        "password",
                        UserType.CenterWorker,
                        20,
                        "914-282-8870",
                        1L
                );
                registerUser(user1);
            }

            if (userRepository.findByEmailAddress("ben@gmail.com").isEmpty()) {
                CenterWorker user2 = new CenterWorker(
                        "Ben",
                        "Szabo",
                        "ben@gmail.com",
                        "password2",
                        UserType.CenterWorker,
                        21,
                        "631-889-5214",
                        1L
                );
                registerUser(user2);
            }

            if (userRepository.findByEmailAddress("Jackson@gmail.com").isEmpty()) {
                Owner user3 = new Owner(
                        "Jackson",
                        "Henry",
                        "Jackson@gmail.com",
                        "password3",
                        UserType.Owner,
                        21,
                        "254-556-7794"
                );
                registerUser(user3);
            }

            if (userRepository.findByEmailAddress("Andrew@gmail.com").isEmpty()) {
                AdoptionCenter adoptionCenter1 = new AdoptionCenter(
                        "Andrew",
                        "Parks",
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
                registerUser(adoptionCenter1);
            }

            System.out.println("Database seeding complete.");
        }catch (IllegalArgumentException e){
            System.out.println(e.getMessage());
        }
    }
}
