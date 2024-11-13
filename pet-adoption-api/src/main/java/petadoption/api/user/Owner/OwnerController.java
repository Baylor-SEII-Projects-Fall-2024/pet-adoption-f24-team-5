package petadoption.api.user.Owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.pet.Pet;

import java.util.List;
import java.util.Optional;

@RequestMapping("/api/owner")
@RestController
public class OwnerController {

    @Autowired
    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) { this.ownerService = ownerService; }

    @GetMapping("/get_saved_pets")
    public ResponseEntity<List<Pet>> getAllSavedPetsByEmail(@RequestParam String email) {
        Optional<List<Pet>> savedPets = ownerService.getAllSavedPetsByEmail(email);

        return savedPets
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/save_pet_user")
    public ResponseEntity<?> savePetToUser(@RequestBody Pet pet, @RequestParam String email) {
        try {
            ownerService.savePetForOwnerByEmail(email, pet);
            return ResponseEntity.status(HttpStatus.OK).body("pet saved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/remove_pet_user")
    public ResponseEntity<?> removePetFromUser(@RequestParam String email, @RequestBody Pet pet) {
        try{
            ownerService.removeSavedPetForOwnerByEmail(email, pet);
            return ResponseEntity.status(HttpStatus.OK).body("pet removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
