package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;
    public Long createEvent(Event event) throws IllegalArgumentException{
        return eventRepository.save(event).event_id;
    }
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
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
        //return eventRepository.findAll(Sort.by(Sort.Direction.ASC, "event_date"));
        return eventRepository.findAll();
    }
}

