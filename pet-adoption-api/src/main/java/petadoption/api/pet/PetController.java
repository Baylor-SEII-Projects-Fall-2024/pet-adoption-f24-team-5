package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.UserRepository;
import petadoption.api.user.UserService;

import java.io.File;
import java.util.List;

@RequestMapping("/api/pets")
@RestController
public class PetController {
    @Autowired
    private final PetService petService;

    @Autowired
    private final UserService userService;
    @Autowired
    private UserRepository userRepository;

    PetController(PetService petService, UserService userService) {
        this.petService = petService;
        this.userService = userService;
    }

    @GetMapping
    public List<Pet> getPets() { return petService.getAllPets(); }

    @PostMapping("/save")
    public ResponseEntity<?> saveUpdatePet(@RequestBody Pet pet, @RequestParam String email) {

        if(pet.getImageName().isEmpty()) { return ResponseEntity.badRequest().body("Image is required");}

        if(email.isEmpty()) { return ResponseEntity.badRequest().body("Email is required");}

        try {
            pet.setAdoptionCenter(userService.findCenterByEmail(email));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        try{
            return ResponseEntity.status(HttpStatus.CREATED).body(petService.savePet(pet));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred, please try again later");
        }

    }

    @PostMapping("/update")
    public ResponseEntity<?> updatePet(@RequestBody Pet pet) {
        if(pet.getPetId() == null) {
            return ResponseEntity.badRequest().body("Pet id is required");
        }

        try {
            return ResponseEntity.status(HttpStatus.OK).body(petService.savePet(pet));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred, please try again later");
        }
    }



}
