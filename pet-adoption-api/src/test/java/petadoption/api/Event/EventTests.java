package petadoption.api.Event;

import io.milvus.v2.client.MilvusClientV2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Mockito;

import org.springframework.boot.test.mock.mockito.MockBean;
import petadoption.api.Event.Event;
import petadoption.api.Event.EventService;
import petadoption.api.PetAdoptionApplicationTests;
import petadoption.api.milvus.MilvusService;
import petadoption.api.milvus.MilvusServiceAdapter;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventTests extends PetAdoptionApplicationTests {


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

    @Test
    void testUpdateEventFail() {
        Event event = new Event();
        event.setEventId(1L);
        event.setEventName("Test Event");

        event.setEventTime(LocalTime.now());

        // Simulate a failure in the updateEvent method
        doThrow(new RuntimeException("Update failed")).when(eventService).updateEvent(event.getEventId(), event);

        try {
            eventService.updateEvent(event.getEventId(), event);
            fail("Exception was not thrown");
        } catch (RuntimeException e) {
            assertEquals("Update failed", e.getMessage());
        }
    }
}
