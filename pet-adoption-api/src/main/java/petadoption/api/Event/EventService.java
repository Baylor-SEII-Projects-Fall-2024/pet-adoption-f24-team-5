package petadoption.api.Event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;

import java.sql.SQLException;
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

