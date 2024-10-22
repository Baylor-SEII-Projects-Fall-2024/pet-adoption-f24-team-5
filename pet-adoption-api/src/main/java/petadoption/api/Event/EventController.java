package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
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
        try {
            eventService.updateEvent(id, updatedEvent);
            return ResponseEntity.ok("Event updated");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @DeleteMapping("/delete_event/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        if(id == null) {return ResponseEntity.badRequest().body("Cannot delete event: event ID is null");}
        try {
            eventService.deleteEvent(id);
            return ResponseEntity.ok("Event deleted");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/create_event")
    public ResponseEntity<?> register(@RequestBody Event event) {
        if(event == null) {return ResponseEntity.badRequest().body("Cannot create event: event not received");}
        if(event.event_description == null) {return ResponseEntity.badRequest().body("Cannot create event: enter a description");}
        if(event.event_time == null) {return ResponseEntity.badRequest().body("Cannot create event: enter a time");}
        if(event.center_id == null) {return ResponseEntity.badRequest().body("Cannot create event: enter a center ID");}
        if(event.event_name == null) {return ResponseEntity.badRequest().body("Cannot create event: enter an event name");}
        if(event.event_date == null) {return ResponseEntity.badRequest().body("Cannot create event: enter an event date");}

        try{
            Long id = eventService.createEvent(event);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }
    @PostMapping("/initialize_events")
    public ResponseEntity<?> initialize() {
        try{
            List<Long> ids = new ArrayList<>();
            List<Event> events;

            LocalDate localDate = LocalDate.now();
            LocalTime localTime = LocalTime.of(19, 30); // Use a LocalTime for the event time
            Event event1 = new Event(
                    1L,
                    "Cool event name",
                    localDate,
                    localTime,
                    "This is the description"
            );
            localTime = LocalTime.of(20, 30); // Use a LocalTime for the event time
            Event event2 = new Event(
                    1L,
                    "Cooler event name",
                    localDate,
                    localTime,
                    "This is the description but longer"
            );

            events = List.of(event1, event2);
            for(Event e : events) {
                ids.add(eventService.createEvent(e));
            }

            return new ResponseEntity<>(ids, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}

