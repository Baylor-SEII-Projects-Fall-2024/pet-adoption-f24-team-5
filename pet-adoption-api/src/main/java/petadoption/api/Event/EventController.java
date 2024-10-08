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
    public List<Event> getEvent() {
        return eventService.findAllEvents();
    }
    @GetMapping
    public Optional<Event> findEvent(Long event_id) {return eventService.findEvent(event_id);}
    @GetMapping
    public Event saveEvent(Event event) {
        return eventService.saveEvent(event);
    }
    @GetMapping
    public void deleteEvent(Long event_id) {
        eventService.deleteEvent(event_id);
    }

    @PostMapping("/create/event")
    public ResponseEntity<?> register(@RequestBody Event event) {
        try{
            Long id = eventService.createEvent(event);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

}

