package petadoption.api.preferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/preferences")
public class PreferenceController {

    @Autowired
    private PreferenceService preferenceService;

    @GetMapping("/get")
    public ResponseEntity<Preference> getPreferences(@RequestParam Long preferenceId) {
        Optional<Preference> preference = preferenceService.getPreference(preferenceId);
        return preference.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }



    @PostMapping("/create/{id}")
    public ResponseEntity<Preference> createPreference(@PathVariable("id") long id,  @RequestBody Preference newPreference) {

        Preference createdPreference = preferenceService.createPreference(id, newPreference);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPreference);
    }


    @PutMapping("/update")
    public ResponseEntity<Preference> updatePreferences(@RequestParam Long preferenceId,
            @RequestBody Preference newPreferences) {
        Preference updatedPreferences = preferenceService.updatePreference(preferenceId, newPreferences);
        if (updatedPreferences != null) {
            return ResponseEntity.ok(updatedPreferences);
        }
        return ResponseEntity.notFound().build();
    }
}
