package petadoption.api.pet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/pets")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class PetController {
    @Autowired
    private PetService petService;

    //public PetController(PetService petService) { this.petService = petService; }


}
