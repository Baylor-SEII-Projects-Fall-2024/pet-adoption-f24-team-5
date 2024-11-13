package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.images.ImageController;
import petadoption.api.images.ImageService;
import petadoption.api.recommendationEngine.RecommendationService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.UserService;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RequestMapping("/api/pets")
@RestController
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;
    private final UserService userService;
    private final ImageService imageService;
    private final RecommendationService recommendationService;


    @GetMapping
    public List<Pet> getPets() {
        return petService.getAllPets();
    }

    @GetMapping("/search_engine")
    public List<Pet> querySearchEngine() {
        List<Pet> pets = petService.getAllPets();

        // TODO: place holder logic just generates random of 3
        // NOTE: no error checking here. There have to be at least 3 pets in the
        // database.
        return pets.stream().collect(Collectors.collectingAndThen(Collectors.toList(), collected -> {
            Collections.shuffle(collected);
            return collected.stream().limit(3).collect(Collectors.toList());
        }));
    }

    @GetMapping("/center")
    public ResponseEntity<?> getPetsCenter(@RequestParam String email) {
        try {
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            List<Pet> pets = petService.getPetByAdoptionCenter(adoptionCenter);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(pets);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePet(@RequestBody Pet pet, @RequestParam String email) {
        if (pet.getImageName().isEmpty()) {
            return ResponseEntity.badRequest().body("Image is required");
        }

        if (email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            double[] petVector = recommendationService.generatePreferenceVector(pet);
            Pet savedPet = petService.savePet(pet, adoptionCenter, petVector);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedPet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PostMapping("/update")
    public ResponseEntity<?> updatePet(@RequestBody Pet pet, @RequestParam String email) {
        if (pet.getPetId() == null) {
            return ResponseEntity.badRequest().body("Pet id is required");
        }

        if (email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            return ResponseEntity.status(HttpStatus.OK)
                    .body(petService.savePet(pet, userService.findCenterByWorkerEmail(email), recommendationService.generatePreferenceVector(pet)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePet(@RequestBody Pet pet) {

        if (pet.getPetId() == null) {
            return ResponseEntity.badRequest().body("Pet id is required");
        }

        try {
            if (!pet.getImageName().isEmpty()) {
                imageService.deleteImage(pet.getImageName());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        try {
            petService.deletePet(pet);
            return ResponseEntity.status(HttpStatus.OK).body("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
