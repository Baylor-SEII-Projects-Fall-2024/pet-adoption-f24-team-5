package petadoption.api.pet;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.images.ImageService;
import petadoption.api.milvus.MilvusServiceAdapter;
import petadoption.api.recommendationEngine.RecommendationService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterService;
import petadoption.api.user.UserService;

import java.util.List;
import java.util.Optional;

@RequestMapping("/api/pets")
@RestController
@RequiredArgsConstructor
public class PetController {

    private final PetService petService;
    private final UserService userService;
    private final ImageService imageService;
    private final RecommendationService recommendationService;
    private final MilvusServiceAdapter milvusServiceAdapter;
    private final AdoptionCenterService adoptionCenterService;

    @GetMapping
    public List<Pet> getPets() {
        return petService.getAllPets();
    }

    @GetMapping("/adoptable")
    public List<Pet> getAdoptablePets() {
        return petService.getAdoptablePets();
    }

    @GetMapping("/available-species")
    public ResponseEntity<?> getAvailableSpecies() {
        try {
            return new ResponseEntity<>(petService.distinctSpecies(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

        try{

            //save pet attached to adoption center
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            Pet savedPet = petService.savePet(pet, adoptionCenter);

            //save pet in vector database
            double[] petVector = recommendationService.generatePreferenceVector(pet);
            milvusServiceAdapter.upsertData(savedPet.petId, petVector,petVector.length, RecommendationService.PET_PARTITION);

            //update adoption center pet count
            adoptionCenterService.updatePetCount(adoptionCenter.getId(),
                    petService.getNumAvailablePetsByAdoptionCenter(adoptionCenter));
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PostMapping("/adopt")
    public ResponseEntity<?> adoptPet(@RequestBody Pet pet, @RequestParam String email) {

        if(pet.getPetId() == null) {
            return ResponseEntity.badRequest().body("Pet id is required");
        }

        if(email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {

            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            Pet adoptedPet = petService.adoptPet(pet, adoptionCenter);

            //decrement pet count
            adoptionCenterService.updatePetCount(pet.getAdoptionCenter().getId(), (adoptionCenter.getNumberOfPets() - 1));

            milvusServiceAdapter.deleteData(pet.getPetId(), RecommendationService.PET_PARTITION);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(adoptedPet);
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
            double [] petVector = recommendationService.generatePreferenceVector(pet);
            milvusServiceAdapter.upsertData(pet.petId, petVector,petVector.length, RecommendationService.PET_PARTITION);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(petService.savePet(pet, userService.findCenterByWorkerEmail(email)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deletePet(@RequestBody Pet pet, @RequestParam String email) {

        if (pet.getPetId() == null) {
            return ResponseEntity.badRequest().body("Pet id is required");
        }

        if(email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        try {
            if (pet.getImageName() != null && !pet.getImageName().isEmpty()) {
                imageService.deleteImage(pet.getImageName());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        try {
            AdoptionCenter tempCenter = userService.findCenterByWorkerEmail(email);

            petService.deletePet(pet);

            int petCount = petService.getNumAvailablePetsByAdoptionCenter(tempCenter);
            adoptionCenterService.updatePetCount(tempCenter.getId(), petCount);

            milvusServiceAdapter.deleteData(pet.petId, RecommendationService.PET_PARTITION);
            return ResponseEntity.status(HttpStatus.OK).body("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
