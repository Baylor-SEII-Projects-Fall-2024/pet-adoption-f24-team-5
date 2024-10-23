package petadoption.api.user;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.Event.Event;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.Owner.Owner;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RequestMapping("/api/users")
@RestController
public class UserController {
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getUser() {
        return userService.findAllUsers();
    }

    // In UserController.java
    @GetMapping("/adoptioncenters")
    public ResponseEntity<List<AdoptionCenter>> getAdoptionCenters() {
        try {
            List<AdoptionCenter> centers = userService.findAllAdoptionCenters();
            return new ResponseEntity<>(centers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getCenterID/{id}")
    public ResponseEntity<?> getCenterID(@PathVariable("id") String id) {
        try {
            // Convert the string ID to a Long
            long workerId = Long.parseLong(id);

            // Find the CenterWorker by the workerId
            CenterWorker centerWorker = userService.findCenterWorker(workerId);

            // If CenterWorker is not found, return a 404 response
            if (centerWorker == null) {
                return new ResponseEntity<>("CenterWorker not found", HttpStatus.NOT_FOUND);
            }

            // Return the centerID if the worker is found
            return new ResponseEntity<>(centerWorker.getCenterID(), HttpStatus.OK);

        } catch (NumberFormatException e) {
            // Return a 400 response if the ID is not a valid Long
            return new ResponseEntity<>("Invalid ID format", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            // Handle any other exceptions
            return new ResponseEntity<>("Error retrieving center ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update/Owner")
    public ResponseEntity<Owner> updateOwner(@RequestBody Owner user, @RequestParam("oldPassword") String oldPassword) {
        return userService.updateOwner(user, oldPassword);
    }

    @PutMapping("/update/Owner/preferenceId")
    public ResponseEntity<Owner> updateOwnerPreferenceId(@RequestBody Owner user) {

        return userService.updateOwnerPreferenceId(user);
    }

    @PutMapping("/update/CenterWorker")
    public ResponseEntity<CenterWorker> updateCenterWorker(@RequestBody CenterWorker user,
            @RequestParam("oldPassword") String oldPassword) {
        return userService.updateCenterWorker(user, oldPassword);
    }

    @PutMapping("/update/CenterOwner")
    public ResponseEntity<AdoptionCenter> updateAdoptionCenter(@RequestBody AdoptionCenter user,
            @RequestParam("oldPassword") String oldPassword) {
        return userService.updateAdoptionCenter(user, oldPassword);
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam("emailAddress") String emailAddress) {
        return new ResponseEntity<>(userService.findUser(emailAddress), HttpStatus.OK);
    }

    @GetMapping("/getDisplayName")
    public ResponseEntity<String> getDisplayName(@RequestParam("emailAddress") String email) {
        return userService.getDisplayName(email);
    }

    @GetMapping("/getAdoptionCenter/{id}")
    public ResponseEntity<?> getAdoptionCenter(@PathVariable("id") Long id) {
        try {
            Optional<AdoptionCenter> optionalAdoptionCenter = userService.findAdoptionCenterById(id);
            if (optionalAdoptionCenter.isPresent()) {
                return new ResponseEntity<>(optionalAdoptionCenter.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>("AdoptionCenter not found", HttpStatus.NOT_FOUND);
        } catch (SQLException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
}
