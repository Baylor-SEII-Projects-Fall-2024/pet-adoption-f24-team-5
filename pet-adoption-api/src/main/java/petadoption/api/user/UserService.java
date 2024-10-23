package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final OwnerRepository ownerRepository;

    private final AdoptionCenterRepository adoptionCenterRepository;

    private final CenterWorkerRepository centerWorkerRepository;

    private final PasswordEncoder passwordEncoder;





    public User findUser(String emailAddress) {
        if (userRepository.findByEmailAddress(emailAddress).get().getUserType() == UserType.CenterWorker) {
            Optional<CenterWorker> worker = centerWorkerRepository.findById(userRepository.findByEmailAddress(emailAddress).get().getId());
            return worker.get();
        }
        else if (userRepository.findByEmailAddress(emailAddress).get().getUserType() == UserType.CenterOwner) {
            Optional<AdoptionCenter> adoptionCenter = adoptionCenterRepository.findById(userRepository.findByEmailAddress(emailAddress).get().getId());
            return adoptionCenter.get();
        }
        else{
            Optional<Owner> owner = ownerRepository.findById(userRepository.findByEmailAddress(emailAddress).get().getId());
            return owner.get();
        }
    }

    public CenterWorker findCenterWorker(long userID) {
        Optional<CenterWorker> centerWorker = centerWorkerRepository.findById(userID);
        if(centerWorker.isEmpty()) {
            throw new IllegalArgumentException("Invalid ID");
        }
        return centerWorker.get();
    }

    public User saveUser(User user) {return userRepository.save(user);}

    public ResponseEntity<Owner> updateOwner(Owner owner, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, findUser(owner.getEmailAddress()).getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Owner newUser = (Owner) findUser(owner.getEmailAddress());
        newUser.setPassword(passwordEncoder.encode(owner.getPassword()));
        newUser.setPhoneNumber(owner.getPhoneNumber());
        newUser.setFirstName(owner.getFirstName());
        newUser.setLastName(owner.getLastName());
        newUser.setAge(owner.getAge());
        newUser.setCenterZip(owner.getCenterZip());
        newUser.getLongAndLat(owner.getCenterZip());
        return new ResponseEntity<>(userRepository.save(newUser), HttpStatus.OK);
    }

    public ResponseEntity<CenterWorker> updateCenterWorker(CenterWorker worker, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, findUser(worker.getEmailAddress()).getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        CenterWorker newUser = (CenterWorker) findUser(worker.getEmailAddress());
        newUser.setPassword(passwordEncoder.encode(worker.getPassword()));
        newUser.setPhoneNumber(worker.getPhoneNumber());
        newUser.setFirstName(worker.getFirstName());
        newUser.setLastName(worker.getLastName());
        newUser.setAge(worker.getAge());
        return new ResponseEntity<>(userRepository.save(newUser), HttpStatus.OK);
    }

    public ResponseEntity<AdoptionCenter> updateAdoptionCenter(AdoptionCenter adoptionCenter, String oldPassword) {
        if (!passwordEncoder.matches(oldPassword, findUser(adoptionCenter.getEmailAddress()).getPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        AdoptionCenter center = (AdoptionCenter) findUser(adoptionCenter.getEmailAddress());
        center.setPassword(passwordEncoder.encode(adoptionCenter.getPassword()));
        center.setPhoneNumber(adoptionCenter.getPhoneNumber());
        center.setCenterName(adoptionCenter.getCenterName());
        center.setCenterAddress(adoptionCenter.getCenterAddress());
        center.setCenterCity(adoptionCenter.getCenterCity());
        center.setCenterState(adoptionCenter.getCenterState());
        center.setCenterZip(adoptionCenter.getCenterZip());
        center.getLongAndLat(adoptionCenter.getCenterZip());
        center.setNumberOfPets(adoptionCenter.getNumberOfPets());
        return new ResponseEntity<>(adoptionCenterRepository.save(center), HttpStatus.OK);
    }

    public ResponseEntity<String> getDisplayName(String email) {
        String displayName = "";
        User user = userRepository.findByEmailAddress(email).get();
        if (user.getUserType() == UserType.CenterWorker){
            displayName = ((CenterWorker) user).getFirstName();
            if (displayName == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        else if (user.getUserType() == UserType.Owner){
            displayName = ((Owner) user).getFirstName();
            if (displayName == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else if (user.getUserType() == UserType.CenterOwner) {
            displayName = ((AdoptionCenter) user).getCenterName();
            if (displayName == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
        return new ResponseEntity<>(displayName, HttpStatus.OK);
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

        AdoptionCenter center;

        User user = userRepository.findByEmailAddress(email).orElse(null);
        if (user == null) {
            throw new SQLException("User not found");
        } else if (user.getUserType() == UserType.CenterOwner) {
            center = (AdoptionCenter) user;
        } else {
            Long centerId = centerWorkerRepository.findCenterIdByEmailAddress(email)
                    .orElseThrow(() -> new SQLException("Could not find center"));

            center = adoptionCenterRepository.findById(centerId)
                    .orElseThrow(() -> new SQLException("Adoption Center Not Found"));
        }

        if(center.getUserType() != UserType.CenterOwner){
            throw new IllegalArgumentException("Email doesn't belong to Center worker");
        } else {
            return center;
        }

    }

    public Optional<AdoptionCenter> findAdoptionCenterByEmail(String email) throws SQLException {
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("email must be valid");
        }
        Optional<User> response = userRepository.findByEmailAddress(email);
        if(response.isPresent()){
            if(response.get().getUserType() == UserType.CenterOwner){
                return adoptionCenterRepository.findById(response.get().getId());
            }
        }
        return Optional.empty();
    }

    public Optional<AdoptionCenter> findAdoptionCenterById(Long id) throws SQLException {
        return adoptionCenterRepository.findById(id);
    }

}
