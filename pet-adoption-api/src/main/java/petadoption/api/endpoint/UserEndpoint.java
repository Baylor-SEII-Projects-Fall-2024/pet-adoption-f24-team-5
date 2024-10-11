package petadoption.api.endpoint;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

import java.util.Optional;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    @GetMapping("/users/{id}")
    public User findUserById(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            log.warn("User not found");
        }

        return user;
    }

    @GetMapping("/users/{id}/emailAddress")
    public ResponseEntity<String> getEmailAddressById(@PathVariable Long id) {
        var user = userService.findUser(id).orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        return ResponseEntity.ok(user.getEmailAddress()); // Assuming the username is the email address
    }

    @PostMapping("/users")
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/users")
    @Transactional
    public User updateUser(@RequestBody User user) {
        return userService.updateUser(user); }
}
