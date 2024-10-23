package petadoption.api.preferences;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
public class PreferenceController {

    @Autowired
    private PreferenceService preferenceService;

    @GetMapping("/get")
    public ResponseEntity<Preference> getPreferences(@RequestParam Long preferenceId) {
        Preference preferences = preferenceService.getPreferences(preferenceId);
        if (preferences != null) {
            return ResponseEntity.ok(preferences);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/create")
    public ResponseEntity<Preference> createPreference(@RequestBody Preference newPreference) {
        Preference createdPreference = preferenceService.createPreference(newPreference);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPreference);
    }

    @PutMapping("/update")
    public ResponseEntity<Preference> updatePreferences(@RequestParam Long preferenceId,
            @RequestBody Preference newPreferences) {
        Preference updatedPreferences = preferenceService.updatePreferences(preferenceId, newPreferences);
        if (updatedPreferences != null) {
            return ResponseEntity.ok(updatedPreferences);
        }
        return ResponseEntity.notFound().build();
    }
}
