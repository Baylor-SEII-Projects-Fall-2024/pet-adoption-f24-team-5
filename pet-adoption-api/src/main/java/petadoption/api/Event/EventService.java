package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }
    public Long createEvent(Event event) throws IllegalArgumentException{
        eventRepository.save(event);
        return event.getEvent_id();
    }
    public ResponseEntity<Event> updateEvent(Long id, Event updatedEvent) {
        // Find the existing event by ID
        return eventRepository.findById(id)
                .map(event -> {
                    // Update fields
                    event.setEventName(updatedEvent.getEventName());
                    event.setCenterId(updatedEvent.getCenterId());
                    event.setEventDate(updatedEvent.getEventDate());
                    event.setEventTime(updatedEvent.getEventTime());
                    event.setDescription(updatedEvent.getDescription());

                    // Save updated event
                    Event savedEvent = eventRepository.save(event);
                    return ResponseEntity.ok(savedEvent);
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 if not found
    }
    public List<Event> findAllEvents() {
        return eventRepository.findAll(Sort.by(Sort.Direction.ASC, "event_date"));
    }
    List<Event> getEvent(){
        return eventRepository.findAll();
    }
}

