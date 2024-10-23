package petadoption.api.event;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.Event.Event;
import petadoption.api.Event.EventRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@Transactional
@SpringBootTest
@ActiveProfiles("testdb")
public class EventRepositoryTest {
    private final LocalDate localDate = LocalDate.now();
    private final LocalTime localTime = LocalTime.now();
    private final Event newEvent = new Event(
            1L,
            "Event name",
            localDate,
            localTime,
            "Event description"
    );

    @Autowired
    private EventRepository eventRepository;

    @Test
    public void testSaveEvent() {
        assertNotNull(newEvent);

        Event savedEvent = eventRepository.save(newEvent);
        assertNotNull(savedEvent);

        Long eid = savedEvent.getEventId();
        assertNotNull(eid);

        Optional<Event> foundEventOpt = eventRepository.findById(eid);
        assertTrue(foundEventOpt.isPresent());
        Event foundEvent = foundEventOpt.get();

        assertEquals(newEvent.getEvent_name(), foundEvent.getEvent_name());
        assertEquals(newEvent.getCenterId(), foundEvent.getCenterId());
        assertEquals(newEvent.getEventDate(), foundEvent.getEventDate());
        assertEquals(newEvent.getEventTime(), foundEvent.getEventTime());
        assertEquals(newEvent.getEventDescription(), foundEvent.getEventDescription());

        eventRepository.deleteAll();
    }

    @Test
    public void testFindEvent() {
        assertNotNull(newEvent);

        Event savedEvent = eventRepository.save(newEvent);
        assertNotNull(savedEvent);

        Long eid = savedEvent.getEventId();
        assertNotNull(eid);

        Optional<Event> foundEventOptT = eventRepository.findById(eid);
        assertTrue(foundEventOptT.isPresent());

        Optional<Event> foundEventOptF = eventRepository.findById(eid+1);
        assertTrue(foundEventOptF.isEmpty());

        eventRepository.deleteAll();
    }
}
