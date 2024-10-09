package petadoption.api.Event;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.UserType;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Configuration
public class EventConfig {
    @Bean
    CommandLineRunner eventCommandLineRunner(EventRepository eventRepository) {
        return args -> {
            Event event1 = new Event(
                    1L,
                    "Cool event name",
                    new Date(),
                    new Time(1,1,1),
                    "This is the description"
            );

            eventRepository.saveAll(List.of(event1));
        };
    }
}