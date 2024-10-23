package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<?> getEvents() {
        try {
            List<Event> events = eventService.findAllEvents();
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping("/update_event/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        if(id == null) {return ResponseEntity.badRequest().body("Cannot update event: event ID is null");}
        if(updatedEvent == null) {return ResponseEntity.badRequest().body("Cannot update event: event is null");}

        try {
            eventService.updateEvent(id, updatedEvent);
            return ResponseEntity.ok("Event updated");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete_event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if(id == null) {return ResponseEntity.badRequest().body("Cannot delete event: event ID is null");}
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("Event deleted");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/create_event")
    public ResponseEntity<?> register(@RequestBody Event event) {
        if(event == null) {return ResponseEntity.badRequest().body("Cannot create event: event not received");}
        try{
            Long id = eventService.createEvent(event);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

