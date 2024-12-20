package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.User;
import petadoption.api.user.UserService;

@Log4j2
@RestController
public class UserEndpoint {
    @Autowired
    private UserService userService;

    /*
     * @GetMapping("/users/{id}")
     * public User findUserById(@PathVariable Long id) {
     * var user = userService.findUser(id);
     * 
     * if (user == null) {
     * log.warn("User not found");
     * }
     * 
     * return user;
     * }
     */

    /*
     * @GetMapping("/users/{id}/emailAddress")
     * public ResponseEntity<String> getEmailAddressById(@PathVariable Long id) {
     * var user = userService.findUser(id);
     * 
     * if (user == null) {
     * return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
     * }
     * 
     * return ResponseEntity.ok(user.getEmailAddress()); // Assuming the username is
     * the email address
     * }
     */

    @PostMapping("/users")
    public User saveUser(@RequestBody User user) {
        return userService.saveUser(user);
    }
}
