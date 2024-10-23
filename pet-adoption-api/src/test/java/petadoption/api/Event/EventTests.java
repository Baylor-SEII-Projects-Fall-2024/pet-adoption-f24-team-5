package petadoption.api.Event;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import petadoption.api.Event.Event;
import petadoption.api.Event.EventService;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventTests {

    @Mock
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testUpdateEvent() {
        Event event = new Event();
        event.setEventId(1L);
        event.setEventName("Test Event");

        event.setEventTime(LocalTime.now());
        

        eventService.updateEvent(event.getEventId(), event);
        
        assertEquals("Test Event", event.getEventName());
    }
}