package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
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
    public List<Event> findAllEvents() {
        return eventRepository.findAll(Sort.by(Sort.Direction.ASC, "event_date"));
    }
    List<Event> getEvent(){
        return eventRepository.findAll();
    }
}

