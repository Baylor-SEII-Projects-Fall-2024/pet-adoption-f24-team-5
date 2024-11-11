package petadoption.api.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.Owner.Owner;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register/owner")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody Owner owner) {
        try {
            return ResponseEntity.ok(authenticationService.register(owner));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register/center-worker")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody CenterWorker centerWorker) {
        try {
            return ResponseEntity.ok(authenticationService.register(centerWorker));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/register/adoption-center")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody AdoptionCenter adoptionCenter) {
        try {
            System.out.println("inside of adoption-center");
            return ResponseEntity.ok(authenticationService.register(adoptionCenter));
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        System.out.println("Entered authenticate method");
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

}
