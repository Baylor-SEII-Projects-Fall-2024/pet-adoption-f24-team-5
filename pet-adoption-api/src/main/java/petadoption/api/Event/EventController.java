package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping("/api/events")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {
    @Autowired
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }
    @GetMapping
    public List<Event> getEvents() {
        return eventService.getEvent();
    }
    @PutMapping("/update_event/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventService.updateEvent(id, updatedEvent);
    }
    @PostMapping("/create_event")
    public ResponseEntity<?> register(@RequestBody Event event) {
        try{
            Long id = eventService.createEvent(event);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }



}

