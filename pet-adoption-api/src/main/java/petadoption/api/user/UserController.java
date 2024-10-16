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
@CrossOrigin(origins = "http://localhost:3000")
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

    @PutMapping("/update/CenterWorker")
    public ResponseEntity<?> updateUser(@RequestBody CenterWorker user) {
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @PutMapping("/update/Owner")
    public ResponseEntity<?> updateUser(@RequestBody Owner user) {
        return ResponseEntity.ok(userService.updateUser(user));
    }

    @PostMapping("/initialize")
    public List<User> initialize() {
        userService.initialize();
        return userService.findAllUsers();
    }



    /*@PutMapping("/update/AdoptionCenter")
    public ResponseEntity<?> updateUser(@RequestBody AdoptionCenter user) {
        System.out.println("inside of AdoptionCenter");
        return ResponseEntity.ok(userService.updateUser(user));
    }*/
    @PutMapping("/updateAdoptionCenter/{id}")
    public ResponseEntity<?> updateUserAdoptionCenter(@RequestBody User user, @PathVariable Long id) {
        System.out.println(user);
        return userService.updateUser(id, user);
    }

    //THIS IS THE ONE
    /*@PutMapping("/updateAdoptionCenter/{id}")
    public String updateAdoptionCenter(@PathVariable int id, @RequestBody User adoptionCenter) {
        return adoptionCenter.getPassword();
    }*/

    /*@PutMapping("/update/AdoptionCenter")
    public ResponseEntity<?> getUser(@RequestParam("id") Long id) {
        User user = userService.findUser(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }*/

    @GetMapping("/getUser")
    public ResponseEntity<?> getUser(@RequestParam("id") Long id) {
        User user = userService.findUser(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
