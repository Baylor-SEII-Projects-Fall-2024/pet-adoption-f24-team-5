package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OwnerRepository ownerRepository;
    @Autowired
    private CenterWorkerRepository workerRepository;
    @Autowired
    private AdoptionCenterRepository adoptionCenterRepository;

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
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
        System.out.println("Inside registerUser for CenterWorker");
        Optional<User> user = userRepository.findByEmailAddress(account.getEmailAddress());
        if (user.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        workerRepository.save( account);
        user = userRepository.findByEmailAddress(account.emailAddress);

        if(user.isEmpty()){
            throw new IllegalArgumentException("Error adding user");
        }
        return user.get().getId();
    }

    public Long registerUser(AdoptionCenter account) throws IllegalArgumentException{
        System.out.println("Inside registerUser for CenterWorker");
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


}
