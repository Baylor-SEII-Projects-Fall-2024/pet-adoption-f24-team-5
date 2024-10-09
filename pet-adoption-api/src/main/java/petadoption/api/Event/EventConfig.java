package petadoption.api.Event;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class EventConfig {
    @Bean
    CommandLineRunner eventCommandLineRunner(EventRepository eventRepository) {
        return args -> {
            // Use LocalDate for event_date to ensure it's a full date
            LocalDate localDate = LocalDate.now();
            LocalTime localTime = LocalTime.of(19, 30); // Use a LocalTime for the event time

            Event event1 = new Event(
                    1L,
                    "Cool event name",
                    java.sql.Date.valueOf(localDate), // Store date as java.sql.Date
                    Time.valueOf(localTime).toLocalTime(),
                    "This is the description"
            );

            eventRepository.saveAll(List.of(event1));
        };
    }
}