package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    private void isValidEvent(Event event) throws IllegalArgumentException {
        if(event == null) {throw new IllegalArgumentException("Cannot create event: event doesn't exist");}
        if(event.event_id != null) {throw new IllegalArgumentException("Cannot create event: event already has ID");}
        if(event.event_description == null || event.event_description.isEmpty()) {throw new IllegalArgumentException("Cannot create event: enter a description");}
        if(event.event_time == null) {throw new IllegalArgumentException("Cannot create event: enter a time");}
        if(event.center_id == null) {throw new IllegalArgumentException("Cannot create event: enter a center ID");}
        if(event.event_name == null || event.event_name.isEmpty()) {throw new IllegalArgumentException("Cannot create event: enter an event name");}
        if(event.event_date == null) {throw new IllegalArgumentException("Cannot create event: enter an event date");}
    }
    public Long createEvent(Event event) throws IllegalArgumentException {
        isValidEvent(event);
        Event newEvent = eventRepository.save(event);
        return newEvent.getEventId();
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
    public Optional<Event> findEvent(Long id) { return eventRepository.findById(id); }
    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }
    public void deleteAllEvents() { eventRepository.deleteAll(); }

    public Optional<List<Event>> findEventsByCenterId(Long center_id) {
        return eventRepository.findEventByCenter_id(center_id);
    }
}

