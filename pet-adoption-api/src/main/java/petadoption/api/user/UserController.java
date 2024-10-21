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

    // Default
    /*@PutMapping("/update/User")
    public ResponseEntity<User> updateUser(@RequestBody User user, @RequestParam("oldPassword") String oldPassword) {
        return userService.updateUser(user, oldPassword);
    }*/

    @PutMapping("/update/Owner")
    public ResponseEntity<Owner> updateOwner(@RequestBody Owner user, @RequestParam("oldPassword") String oldPassword) {
        return userService.updateOwner(user, oldPassword);
    }

    @PutMapping("/update/CenterWorker")
    public ResponseEntity<CenterWorker> updateCenterWorker(@RequestBody CenterWorker user, @RequestParam("oldPassword") String oldPassword) {
        return userService.updateCenterWorker(user, oldPassword);
    }

    @PutMapping("/update/CenterOwner")
    public ResponseEntity<AdoptionCenter> updateAdoptionCenter(@RequestBody AdoptionCenter user, @RequestParam("oldPassword") String oldPassword) {
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
}
