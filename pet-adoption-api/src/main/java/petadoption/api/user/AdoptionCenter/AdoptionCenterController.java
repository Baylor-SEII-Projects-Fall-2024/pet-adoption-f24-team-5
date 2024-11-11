package petadoption.api.user.AdoptionCenter;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.user.UserService;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/adoption-center")
@RequiredArgsConstructor
public class AdoptionCenterController {
    private final AdoptionCenterService adoptionCenterService;
    private final UserService userService;

    @GetMapping("/getCenterID/{email}")
    public ResponseEntity<?> getCenterID(@PathVariable("email") String email) {
        try {
            Optional<AdoptionCenter> adoptionCenter = userService.findAdoptionCenterByEmail(email);
            if (adoptionCenter.isPresent()) {
                return new ResponseEntity<>(adoptionCenter.get().getId(), HttpStatus.OK);
            }
            return new ResponseEntity<>("Did not find Adoption center with email: " + email, HttpStatus.NOT_FOUND);
        } catch (SQLException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @GetMapping("/getEmployees/{id}")
    public ResponseEntity<?> getEmployees(@PathVariable("id") Long id) {
        Optional<List<CenterWorker>> workers = adoptionCenterService.findAllCenterWorkers(id);
        if (workers.isPresent()) {
            return new ResponseEntity<>(workers.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>("Did not find employees with id: " + id, HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/deleteEmployee/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id) {
        adoptionCenterService.deleteCenterWorker(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
