package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import petadoption.api.Event.Event;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;

import javax.swing.text.html.Option;
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

    public Optional<?> findUser(String emailAddress) {
        Optional<User> userOpt = userRepository.findByEmailAddress(emailAddress);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            switch (user.getUserType()) {
                case CenterWorker:
                    return centerWorkerRepository.findById(user.getId());
                case CenterOwner:
                    return adoptionCenterRepository.findById(user.getId());
                default: // Assume the default is for Owners
                    return ownerRepository.findById(user.getId());
            }
        }

        return Optional.empty();
    }

    public User saveUser(User user) {return userRepository.save(user);}

    public Owner updateOwner(Owner owner, String oldPassword) throws IllegalAccessException {
        if (findUser(owner.getEmailAddress()).isEmpty()){
            throw new IllegalAccessException("User not found");
        }
        if (!passwordEncoder.matches(oldPassword, ((Owner)findUser(owner.getEmailAddress()).get()).getPassword())) {
            System.out.println("Old password: " + oldPassword);
            throw new IllegalAccessException("Invalid credentials");
        }
        Owner newUser = (Owner) findUser(owner.getEmailAddress()).get();
        newUser.setPassword(passwordEncoder.encode(owner.getPassword()));
        newUser.setPhoneNumber(owner.getPhoneNumber());
        newUser.setFirstName(owner.getFirstName());
        newUser.setLastName(owner.getLastName());
        newUser.setAge(owner.getAge());
        return userRepository.save(newUser);
    }

    public CenterWorker updateCenterWorker(CenterWorker worker, String oldPassword) throws IllegalAccessException {
        if (!passwordEncoder.matches(oldPassword, ((CenterWorker) findUser(worker.getEmailAddress()).get()).getPassword())) {
            throw new IllegalAccessException("Invalid credentials");
        }
        CenterWorker newUser = (CenterWorker) findUser(worker.getEmailAddress()).get();
        newUser.setPassword(passwordEncoder.encode(worker.getPassword()));
        newUser.setPhoneNumber(worker.getPhoneNumber());
        newUser.setFirstName(worker.getFirstName());
        newUser.setLastName(worker.getLastName());
        newUser.setAge(worker.getAge());
        return userRepository.save(newUser);
    }

    public AdoptionCenter updateAdoptionCenter(AdoptionCenter adoptionCenter, String oldPassword) throws IllegalAccessException {
        if (!passwordEncoder.matches(oldPassword, ((AdoptionCenter) findUser(adoptionCenter.getEmailAddress()).get()).getPassword())) {
            throw new IllegalAccessException("Invalid credentials");
        }
        AdoptionCenter center = (AdoptionCenter) findUser(adoptionCenter.getEmailAddress()).get();
        center.setPassword(passwordEncoder.encode(adoptionCenter.getPassword()));
        center.setPhoneNumber(adoptionCenter.getPhoneNumber());
        center.setCenterName(adoptionCenter.getCenterName());
        center.setCenterAddress(adoptionCenter.getCenterAddress());
        center.setCenterCity(adoptionCenter.getCenterCity());
        center.setCenterState(adoptionCenter.getCenterState());
        center.setCenterZip(adoptionCenter.getCenterZip());
        center.setNumberOfPets(adoptionCenter.getNumberOfPets());
        return adoptionCenterRepository.save(center);
    }

    public String getDisplayName(String email) {
        String displayName = "";
        if (userRepository.findByEmailAddress(email).isEmpty()) {
            throw new EntityNotFoundException("User has no display name");
        }
        User user = userRepository.findByEmailAddress(email).get();
        if (userRepository.findByEmailAddress(email).get().getUserType() == UserType.CenterWorker){
            displayName = ((CenterWorker) user).getFirstName();
            if (displayName == null) {
                throw new EntityNotFoundException("User not found");
            }
        }
        else if (userRepository.findByEmailAddress(email).get().getUserType() == UserType.Owner){
            displayName = ((Owner) user).getFirstName();
            if (displayName == null) {
                throw new EntityNotFoundException("User not found");
            }
        } else if (userRepository.findByEmailAddress(email).get().getUserType() == UserType.CenterOwner) {
            displayName = ((AdoptionCenter) user).getCenterName();
            if (displayName == null) {
                throw new EntityNotFoundException("User not found");
            }
        }
        return displayName;
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

    public AdoptionCenter findCenterByWorkerEmail(String email) throws SQLException {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("email must be valid");
        }
        System.out.println(email);

        Long centerId = centerWorkerRepository.findCenterIdByEmailAddress(email)
                .orElseThrow(() -> new SQLException("Could not find center "));
        System.out.println(centerId);

        AdoptionCenter center = adoptionCenterRepository.findById(centerId)
                .orElseThrow(() -> new SQLException("Adoption Center Not Found"));
        System.out.println(center);

        if(center.getUserType() != UserType.CenterOwner){
            throw new IllegalArgumentException("Email doesn't belong to Center worker");
        } else {
            return center;
        }

    }

}
