package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
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
        System.out.println("c");
        eventRepository.save(event);
        System.out.println("d");
        return event.getEvent_id();
    }

    List<Event> getEvent(){
        return eventRepository.findAll();
    }
}

