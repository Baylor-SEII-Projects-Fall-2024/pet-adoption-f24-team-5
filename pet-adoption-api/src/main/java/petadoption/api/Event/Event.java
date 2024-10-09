package petadoption.api.Event;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Time;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
@Data
@Entity
@Table(name = Event.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
public class Event {
    public static final String TABLE_NAME = "EVENTS";
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    public static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "EVENT_ID")
    protected Long event_id;

    @Column(name = "Center_ID")
    protected Long center_id;

    @Column(name = "EVENT_DATE")
    protected Date event_date;

    @Column(name = "EVENT_TIME")
    protected Time event_time;

    @Column(name = "DESCRIPTION")
    protected String description;

    public Event() {}

    public Event(Long center_id, Date event_date, Time event_time, String description) {
        this.center_id = center_id;
        this.event_date = event_date;
        this.event_time = event_time;
        this.description = description;

    }
    public Event(Long event_id, Long center_id, Date event_date, Time event_time, String description) {
        this.event_id = event_id;
        this.center_id = center_id;
        this.event_date = event_date;
        this.event_time = event_time;
        this.description = description;
    }
    public Event(String center_id, String event_date, String event_time, String description) throws Exception {
        this.center_id = Long.parseLong(center_id);
        this.event_date = dateFormat.parse(event_date);
        this.event_time = new java.sql.Time(timeFormat.parse(event_time).getTime());
        this.description = description;
    }
}
