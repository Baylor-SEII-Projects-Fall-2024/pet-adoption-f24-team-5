package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
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
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private final OwnerRepository ownerRepository;

    private final AdoptionCenterRepository adoptionCenterRepository;

    private final CenterWorkerRepository centerWorkerRepository;

    private final PasswordEncoder passwordEncoder;

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

    public CenterWorker findCenterWorker(long userID) {
        Optional<CenterWorker> centerWorker = centerWorkerRepository.findById(userID);
        if (centerWorker.isEmpty()) {
            throw new IllegalArgumentException("Invalid ID");
        }
        return centerWorker.get();
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }


    public Owner updateOwner(Owner owner, String oldPassword) throws IllegalAccessException {
        if (findUser(owner.getEmailAddress()).isEmpty()) {
            throw new IllegalAccessException("User not found");
        }
        if (!passwordEncoder.matches(oldPassword, ((Owner) findUser(owner.getEmailAddress()).get()).getPassword())) {
            throw new IllegalAccessException("Invalid credentials");
        }
        Owner newUser = (Owner) findUser(owner.getEmailAddress()).get();
        newUser.setPassword(passwordEncoder.encode(owner.getPassword()));
        newUser.setPhoneNumber(owner.getPhoneNumber());
        newUser.setFirstName(owner.getFirstName());
        newUser.setLastName(owner.getLastName());
        newUser.setAge(owner.getAge());
        newUser.setCenterZip(owner.getCenterZip());
        newUser.getLongAndLat(owner.getCenterZip());
        return userRepository.save(newUser);
    }

    public CenterWorker updateCenterWorker(CenterWorker worker, String oldPassword) throws IllegalAccessException {
        if (findUser(worker.getEmailAddress()).isEmpty()) {
            throw new IllegalAccessException("User not found");
        }
        if (!passwordEncoder.matches(oldPassword,
                ((CenterWorker) findUser(worker.getEmailAddress()).get()).getPassword())) {
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

    /*public ResponseEntity<Owner> addPetToSavedPets(String email, Long petId) {
        Owner newUser = (Owner) findUser(email).get();

        List<Long> savedPetIds = newUser.getSavedPetIds();
        if (!savedPetIds.contains(petId)) {
            newUser.addPetToSavedPets(petId);
        }

        return new ResponseEntity<>(userRepository.save(newUser), HttpStatus.OK);
    }*/

 /*   public ResponseEntity<Owner> updateOwnerPreferenceId(Owner owner) {
        Owner newUser = (Owner) findUser(owner.getEmailAddress()).get();
        newUser.setPreferenceWeights(owner.getPreferenceWeights());
        return new ResponseEntity<>(userRepository.save(newUser), HttpStatus.OK);
    }*/

    public AdoptionCenter updateAdoptionCenter(AdoptionCenter adoptionCenter, String oldPassword)
            throws IllegalAccessException {
        if (findUser(adoptionCenter.getEmailAddress()).isEmpty()) {
            throw new IllegalAccessException("User not found");
        }
        if (!passwordEncoder.matches(oldPassword,
                ((AdoptionCenter) findUser(adoptionCenter.getEmailAddress()).get()).getPassword())) {
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
        center.getLongAndLat(adoptionCenter.getCenterZip());
        center.setNumberOfPets(adoptionCenter.getNumberOfPets());
        return adoptionCenterRepository.save(center);
    }

    public String getDisplayName(String email) {
        String displayName = "";
        if (userRepository.findByEmailAddress(email).isEmpty()) {
            throw new EntityNotFoundException("User has no display name");
        }
        User user = userRepository.findByEmailAddress(email).get();
        if (user.getUserType() == UserType.CenterWorker) {
            displayName = ((CenterWorker) user).getFirstName();
            if (displayName == null) {
                throw new EntityNotFoundException("User not found");
            }
        } else if (user.getUserType() == UserType.Owner) {
            displayName = ((Owner) user).getFirstName();
            if (displayName == null) {
                throw new EntityNotFoundException("User not found");
            }
        } else if (user.getUserType() == UserType.CenterOwner) {
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

        if (center.getUserType() != UserType.CenterOwner) {
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
        if (response.isPresent()) {
            if (response.get().getUserType() == UserType.CenterOwner) {
                return adoptionCenterRepository.findById(response.get().getId());
            }
        }
        return Optional.empty();
    }

    public Optional<AdoptionCenter> findAdoptionCenterById(Long id) throws SQLException {
        return adoptionCenterRepository.findById(id);
    }

}
