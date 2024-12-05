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
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            Pet savedPet = petService.savePet(pet, adoptionCenter);

            adoptionCenterService.updatePetCount(adoptionCenter.getId(),
                    petService.getAvailablePetsByAdoptionCenter(adoptionCenter).size());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPet);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

    }

    @PostMapping("/adopt")
    public ResponseEntity<?> adoptPet(@RequestBody Pet pet, @RequestParam String email) {
        try {
            //TODO: change this to use milvus
            AdoptionCenter adoptionCenter = userService.findCenterByWorkerEmail(email);
            double[] petVector = recommendationService.generatePreferenceVector(pet);
            Pet savedPet = petService.savePet(pet, adoptionCenter);

            Optional<AdoptionCenter> tempCenter = adoptionCenterService.findById(pet.getAdoptionCenter().getId());
            if(tempCenter.isPresent()) {
                int petCount = petService.getAvailablePetsByAdoptionCenter(pet.getAdoptionCenter()).size();
                adoptionCenterService.updatePetCount(pet.getAdoptionCenter().getId(), petCount);
            }

            milvusServiceAdapter.upsertData(savedPet.petId, petVector,petVector.length, recommendationService.PET_PARTITION);
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
            double [] petVector = recommendationService.generatePreferenceVector(pet);
            milvusServiceAdapter.upsertData(pet.petId, petVector,petVector.length, recommendationService.PET_PARTITION);
            return ResponseEntity.status(HttpStatus.OK)
                    .body(petService.savePet(pet, userService.findCenterByWorkerEmail(email)));
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
            if (!pet.getImageName().isEmpty() || pet.getAdoptionStatus() != null) {
                imageService.deleteImage(pet.getImageName());
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        try {
            petService.deletePet(pet);

            Optional<AdoptionCenter> tempCenter = adoptionCenterService.findById(pet.getAdoptionCenter().getId());
            if(tempCenter.isPresent()) {
                int petCount = petService.getAvailablePetsByAdoptionCenter(pet.getAdoptionCenter()).size();
                adoptionCenterService.updatePetCount(pet.getAdoptionCenter().getId(), petCount);
            }

            milvusServiceAdapter.deleteData(pet.petId, recommendationService.PET_PARTITION);
            return ResponseEntity.status(HttpStatus.OK).body("Pet deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
