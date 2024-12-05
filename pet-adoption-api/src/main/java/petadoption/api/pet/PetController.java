package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import petadoption.api.images.ImageController;
import petadoption.api.images.ImageService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterService;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.UserRepository;
import petadoption.api.user.UserService;

import java.io.File;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("/api/pets")
@RestController
public class PetController {
    @Autowired
    private final PetService petService;

    @Autowired
    private final UserService userService;

    @Autowired
    private final ImageService imageService;

    @Autowired
    private final AdoptionCenterService adoptionCenterService;

    PetController(PetService petService, UserService userService, ImageService imageService, AdoptionCenterService adoptionCenterService) {
        this.petService = petService;
        this.userService = userService;
        this.imageService = imageService;
        this.adoptionCenterService = adoptionCenterService;
    }

    @GetMapping
    public List<Pet> getPets() { return petService.getAllPets(); }

    @GetMapping("/search_engine")
    public List<Pet> querySearchEngine() {
        List<Pet> pets = petService.getAllPets();

        //TODO: place holder logic just generates random of 3
        //NOTE: no error checking here. There have to be at least 3 pets in the database.
        return pets.stream().collect(Collectors.collectingAndThen(Collectors.toList(), collected -> {
            Collections.shuffle(collected);
            return collected.stream().limit(3).collect(Collectors.toList());
        }));
    }

    @GetMapping("/center")
    public ResponseEntity<?> getPetsCenter(@RequestParam String email) {
        try {
            return ResponseEntity.status(HttpStatus.OK).body(petService.getPetByAdoptionCenter(userService.findCenterByWorkerEmail(email)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePet(@RequestBody Pet pet, @RequestParam String email) {
        if(pet.getImageName().isEmpty()) { return ResponseEntity.badRequest().body("Image is required");}

        if(email.isEmpty()) { return ResponseEntity.badRequest().body("Email is required");}

        try{
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            Pet savedPet = petService.savePet(pet, adoptionCenter);

            adoptionCenterService.updatePetCount(adoptionCenter.getId(),
                    petService.getPetByAdoptionCenter(adoptionCenter).size());
            return ResponseEntity.status(HttpStatus.CREATED).body(petService.savePet(pet, userService.findCenterByWorkerEmail(email)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PostMapping("/adopt")
    public ResponseEntity<?> adoptPet(@RequestBody Pet pet, @RequestParam String email) {
        try {
            Optional<?> user = userService.findUser(email);
            if(user.isPresent() && user.get() instanceof Owner) {
                petService.adoptPet(pet, (Owner) user.get());

                long adoptionCenterID = pet.getAdoptionCenter().getId();
                Optional<AdoptionCenter> tempCenter = adoptionCenterService.findById(adoptionCenterID);
                if(tempCenter.isPresent()) {
                    int petCount = petService.getPetByAdoptionCenter(tempCenter.get()).size();
                    adoptionCenterService.updatePetCount(adoptionCenterID, petCount);
                }
            }
            else {
                return ResponseEntity.badRequest().body("Email not an owner");
            }
            return ResponseEntity.status(HttpStatus.OK).body("");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/update")
    public ResponseEntity<?> updatePet(@RequestBody Pet pet, @RequestParam String email) {
        if(pet.getPetId() == null) { return ResponseEntity.badRequest().body("Pet id is required");}

        if(email.isEmpty()) { return ResponseEntity.badRequest().body("Email is required");}


        try {
            return ResponseEntity.status(HttpStatus.OK).body(petService.savePet(pet, userService.findCenterByWorkerEmail(email)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePet(@RequestBody Pet pet) {

        if(pet.getPetId() == null) { return ResponseEntity.badRequest().body("Pet id is required");}

        try {
            if (!pet.getImageName().isEmpty()) {
                imageService.deleteImage(ImageController.UPLOAD_DIRECTORY, pet.getImageName());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        try {
            petService.deletePet(pet);

            long adoptionCenterID = pet.getAdoptionCenter().getId();
            Optional<AdoptionCenter> tempCenter = adoptionCenterService.findById(adoptionCenterID);
            if(tempCenter.isPresent()) {
                int petCount = petService.getPetByAdoptionCenter(tempCenter.get()).size();
                adoptionCenterService.updatePetCount(adoptionCenterID, petCount);
            }

            return ResponseEntity.status(HttpStatus.OK).body("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }



}
