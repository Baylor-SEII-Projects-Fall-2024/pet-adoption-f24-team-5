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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try{
            User user = userService.loginUser(request.getEmail(), request.getPassword());
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/initialize")
    public List<User> initialize() {
        userService.initialize();
        return userService.findAllUsers();
    }

    @PutMapping("/update/User/{id}")
    public ResponseEntity<User> UpdateUser(@RequestBody User user, @PathVariable Long id) {
        return userService.updateUser(user);
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam("emailAddress") String emailAddress) {
        User user = userService.findUser(emailAddress);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
