package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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



    public User findUser(String emailAddress) {
        Optional<User> user = userRepository.findByEmailAddress(emailAddress);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user.get();
    }

    public User saveUser(User user) {return userRepository.save(user);}

    public User updateUser(CenterWorker user) {
        CenterWorker existingUser = centerWorkerRepository.findById(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + user.getId()));

        existingUser.setPassword(user.getPassword());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setAge(user.getAge());
        return centerWorkerRepository.save(existingUser);
    }

    public User updateUser(Owner user) {
        Owner existingUser = ownerRepository.findById(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + user.getId()));

        existingUser.setPassword(user.getPassword());
        existingUser.setPhoneNumber(user.getPhoneNumber());
        existingUser.setAge(user.getAge());
        return ownerRepository.save(existingUser);
    }

    public ResponseEntity<User> updateUser(Long id, User user) {
        //AdoptionCenter existingUser = adoptionCenterRepository.findById(user.getId())
        //        .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + user.getId()));
        System.out.println("User inside update: " + userRepository.findById(id).get());
        return userRepository.findById(id)
                .map(event -> {
                    // Update fields
                    event.setPassword(user.getPassword());
                    event.setPhoneNumber(user.getPhoneNumber());

                    // Save updated event
                    User savedUser = userRepository.save(event);
                    return ResponseEntity.ok(savedUser);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
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

}
