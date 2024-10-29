package petadoption.api.Event;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.UserService;

import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequestMapping("/api/events")
@RestController
public class EventController {
    @Autowired
    private final EventService eventService;
    @Autowired
    private final UserService userService;

    public EventController(EventService eventService, UserService userService) {
        this.eventService = eventService;
        this.userService = userService;
    }


    @GetMapping("/getCenterEvents/{email}")
    public ResponseEntity<?> getCenterWorkerEvents(@PathVariable("email") String email) {
        boolean checkIfAdoptionCenter = false;
        AdoptionCenter center = null;
        try{
            center = userService.findCenterByWorkerEmail(email);

        } catch (SQLException e ){
            String message = e.getMessage();
            if(!message.equals("Could not find center")){
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
            checkIfAdoptionCenter = true;
        }

        try {
            if(checkIfAdoptionCenter){
                Optional<AdoptionCenter> centerOptional = userService.findAdoptionCenterByEmail(email);
                if(centerOptional.isEmpty()){
                    return new ResponseEntity<>("Could not find adoption center",HttpStatus.NOT_FOUND);
                }
                center = centerOptional.get();
            }

            Optional<List<Event>> events = eventService.findEventsByCenterId(center.getId());
            if(events.isEmpty()){
                List<Event> eventList = new ArrayList<>();
                return new ResponseEntity<>(eventList,HttpStatus.OK);
            }
            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    @PostMapping("/create_event/{email}")
    public ResponseEntity<?> createEvent(@PathVariable String email, @RequestBody Event event) {
        if(event == null) {return ResponseEntity.badRequest().body("Cannot create event: event not received");}

        boolean checkIfAdoptionCenter = false;
        AdoptionCenter center = null;
        try{
            center = userService.findCenterByWorkerEmail(email);
            checkIfAdoptionCenter = true;

        } catch (SQLException e ){
            String message = e.getMessage();
            if(!message.equals("Could not find center")){
                return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
            }
        }

        try {
            if(checkIfAdoptionCenter){
                Optional<AdoptionCenter> centerOptional = userService.findAdoptionCenterByEmail(email);
                if(centerOptional.isEmpty()){
                    return new ResponseEntity<>("Could not find adoption center",HttpStatus.NOT_FOUND);
                }
                center = centerOptional.get();
                event.setCenterId(center.getId());
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        try{
            Long id = eventService.createEvent(event);
            return new ResponseEntity<>(id, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PostMapping("/initialize_events")
    public ResponseEntity<?> initialize() {
        try{
            List<Long> ids = new ArrayList<>();
            List<Event> events;

            LocalDate localDate = LocalDate.now();
            LocalTime localTime = LocalTime.of(22, 30); // Use a LocalTime for the event time
            Event event1 = new Event(
                    5L,
                    "Sick event, lots of pets",
                    localDate,
                    localTime,
                    "This is the description"
            );
            localTime = LocalTime.of(23, 30); // Use a LocalTime for the event time
            Event event2 = new Event(
                    6L,
                    "Sicker event, even more pets",
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

