package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    private void isValidEvent(Event event) throws IllegalArgumentException {
        if(event.event_description == null) {throw new IllegalArgumentException("Cannot create event: enter a description");}
        if(event.event_time == null) {throw new IllegalArgumentException("Cannot create event: enter a time");}
        if(event.center_id == null) {throw new IllegalArgumentException("Cannot create event: enter a center ID");}
        if(event.event_name == null) {throw new IllegalArgumentException("Cannot create event: enter an event name");}
        if(event.event_date == null) {throw new IllegalArgumentException("Cannot create event: enter an event date");}
    }
    public Long createEvent(Event event) throws IllegalArgumentException {
        isValidEvent(event);
        return eventRepository.save(event).event_id;
    }
    public void deleteEvent(Long id) throws IllegalArgumentException {
        if(id == null) {throw new IllegalArgumentException("Cannot delete event: id is null");}
        eventRepository.deleteById(id);
    }
    public void updateEvent(Long id, Event updatedEvent) throws IllegalArgumentException {
        if(id == null) {throw new IllegalArgumentException("Cannot update event: id is null");}
        isValidEvent(updatedEvent);

        eventRepository.findById(id).map(event -> {
            event.setEventName(updatedEvent.getEventName());
            event.setCenterId(updatedEvent.getCenterId());
            event.setEventDate(updatedEvent.getEventDate());
            event.setEventTime(updatedEvent.getEventTime());
            event.setEventDescription(updatedEvent.getEventDescription());

            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.ok(savedEvent);
        }).orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 if not found
    }
    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }
}

