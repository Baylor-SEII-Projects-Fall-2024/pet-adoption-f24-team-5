package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Time;
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

    @PostMapping("initialize_events")
    public ResponseEntity<?> initialize() {

        //eventRepository.saveAll(List.of(event1));
        try{
            List<Long> ids = new ArrayList<Long>();
            List<Event> events = new ArrayList<Event>();

            LocalDate localDate = LocalDate.now();
            LocalTime localTime = LocalTime.of(19, 30); // Use a LocalTime for the event time
            Event event1 = new Event(
                    1L,
                    "Cool event name",
                    java.sql.Date.valueOf(localDate), // Store date as java.sql.Date
                    Time.valueOf(localTime).toLocalTime(),
                    "This is the description"
            );
            localTime = LocalTime.of(20, 30); // Use a LocalTime for the event time
            Event event2 = new Event(
                    1L,
                    "Cooler event name",
                    java.sql.Date.valueOf(localDate), // Store date as java.sql.Date
                    Time.valueOf(localTime).toLocalTime(),
                    "This is the description but longer"
            );

            events = List.of(event1, event2);
            for(Event e : events) {
                ids.add(eventService.createEvent(e));
            }
            return new ResponseEntity<>(ids, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }



}

