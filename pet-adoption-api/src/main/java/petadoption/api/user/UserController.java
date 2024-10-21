package petadoption.api.user;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.Owner.Owner;

import java.sql.SQLException;
import java.util.List;

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

    @PutMapping("/update/User")
    public ResponseEntity<User> UpdateUser(@RequestBody User user, @RequestParam("oldPassword") String oldPassword) {
        return userService.updateUser(user, oldPassword);
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam("emailAddress") String emailAddress) {
        User user = userService.findUser(emailAddress);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/getFirstName")
    public ResponseEntity<String> getFirstName(@RequestParam("emailAddress") String email) {
        return userService.getFirstName(email);
    }
}
