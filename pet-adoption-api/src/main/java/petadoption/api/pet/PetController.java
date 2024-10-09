package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/pets")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {
    @Autowired
    private PetService petService;

    @GetMapping
    public List<Pet> getPets() { return petService.getAllPets(); }

    @PostMapping("/save/pet")
    public void addPet(@RequestBody Pet pet) {
        petService.savePet(pet);
    }

}
