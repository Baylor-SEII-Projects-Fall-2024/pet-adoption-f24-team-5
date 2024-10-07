package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public Optional<Event> findEvent(Long event_id) {return eventRepository.findById(event_id);}

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public void deleteEvent(Long event_id) {
        eventRepository.deleteById(event_id);
    }

    public List<Event> findAllEvents() {
        return eventRepository.findAll();
    }

    public Long createEvent(Event event) throws IllegalArgumentException{
        eventRepository.save(event);
        return event.getEvent_id();
    }
}

