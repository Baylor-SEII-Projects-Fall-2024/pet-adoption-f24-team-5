package petadoption.api.event;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.Event.Event;
import petadoption.api.Event.EventService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
@Transactional
@SpringBootTest
@ActiveProfiles("testdb")
public class EventServiceTest {
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
    private EventService eventService;

    @Test
    public void testValidEvent() {
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(null);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(null, "event",localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "",localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, null,localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",null,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",localDate,null,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",localDate,localTime,""));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",localDate,localTime,null));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(null);
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(null, "event",localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "",localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, null,localDate,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",null,localTime,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",localDate,null,"desc"));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L, "event",localDate,localTime,""));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(null, null,null,null,null));
        });
        assertThrows(IllegalArgumentException.class, () -> {
            eventService.createEvent(new Event(1L,1L, "event",localDate,localTime,"desc"));
        });
    }
    @Test
    public void testCreateEvent() {
        assertNotNull(newEvent);

        Long eid = eventService.createEvent(newEvent);
        assertNotNull(eid);

        Optional<Event> foundEventOpt = eventService.findEvent(eid);
        assertTrue(foundEventOpt.isPresent());

        Event foundEvent = foundEventOpt.get();
        assertEquals(newEvent.getEvent_name(), foundEvent.getEvent_name());
        assertEquals(newEvent.getCenterId(), foundEvent.getCenterId());
        assertEquals(newEvent.getEventDate(), foundEvent.getEventDate());
        assertEquals(newEvent.getEventTime(), foundEvent.getEventTime());
        assertEquals(newEvent.getEventDescription(), foundEvent.getEventDescription());

        eventService.deleteAllEvents();
        assertTrue(eventService.findAllEvents().isEmpty());
    }

    @Test
    public void testFindEvent() {
        assertNotNull(newEvent);

        Long eid = eventService.createEvent(newEvent);
        assertNotNull(eid);

        Optional<Event> foundEventOptT = eventService.findEvent(eid);
        assertTrue(foundEventOptT.isPresent());

        Optional<Event> foundEventOptF = eventService.findEvent(eid+1);
        assertTrue(foundEventOptF.isEmpty());

        eventService.deleteAllEvents();
        assertTrue(eventService.findAllEvents().isEmpty());
    }

    @Test
    public void testUpdateEvent() {
        LocalDate localDate = LocalDate.of(1,1,1);
        LocalTime localTime = LocalTime.of(1,1);
        Event coolerEvent = new Event(
                2L,
                "Cool event name",
                localDate,
                localTime,
                "Cool Event description"
        );
        Long eid = eventService.createEvent(newEvent);
        assertNotNull(eid);

        eventService.updateEvent(eid, coolerEvent);
        Optional<Event> foundEventOpt = eventService.findEvent(eid);
        assertTrue(foundEventOpt.isPresent());

        Event foundEvent = foundEventOpt.get();
        assertEquals(coolerEvent.getEvent_name(), foundEvent.getEvent_name());
        assertEquals(coolerEvent.getCenterId(), foundEvent.getCenterId());
        assertEquals(coolerEvent.getEventDate(), foundEvent.getEventDate());
        assertEquals(coolerEvent.getEventTime(), foundEvent.getEventTime());
        assertEquals(coolerEvent.getEventDescription(), foundEvent.getEventDescription());

        eventService.deleteAllEvents();
        assertTrue(eventService.findAllEvents().isEmpty());
    }

    @Test
    public void testDeleteEvent() {
        assertNotNull(newEvent);

        Long eid = eventService.createEvent(newEvent);
        assertNotNull(eid);
        eventService.deleteEvent(eid);

        Optional<Event> foundEventOptT = eventService.findEvent(eid);
        assertTrue(foundEventOptT.isEmpty());

        eventService.deleteAllEvents();
        assertTrue(eventService.findAllEvents().isEmpty());
    }
}