package petadoption.api.Event;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = Event.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
public class Event {
    public static final String TABLE_NAME = "EVENTS";
    public static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
    public static final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EVENT_ID")
    protected Long event_id;

    @Column(name = "CENTER_ID")
    protected Long center_id;

    @Column(name = "EVENT_NAME")
    protected String event_name;

    @Column(name = "EVENT_DATE")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    protected LocalDate event_date;

    @Column(name = "EVENT_TIME")
    @Convert(converter = LocalTimeConverter.class)
    protected LocalTime event_time;

    @Column(name = "DESCRIPTION")
    protected String description;

    public Event() {}

    public Event(Long center_id, String event_name, LocalDate event_date, LocalTime event_time, String description) {
        this.center_id = center_id;
        this.event_name = event_name;
        this.event_date = event_date;
        this.event_time = event_time;
        this.description = description;

    }
    public Event(Long event_id, Long center_id, String event_name, LocalDate event_date, LocalTime event_time, String description) {
        this.event_id = event_id;
        this.center_id = center_id;
        this.event_name = event_name;
        this.event_date = event_date;
        this.event_time = event_time;
        this.description = description;
    }

    public Long getEventId() {
        return event_id;
    }

    public void setEventId(Long event_id) {
        this.event_id = event_id;
    }

    public Long getCenterId() {
        return center_id;
    }

    public void setCenterId(Long center_id) {
        this.center_id = center_id;
    }

    public String getEventName() {
        return event_name;
    }

    public void setEventName(String event_name) {
        this.event_name = event_name;
    }

    public LocalDate getEventDate() {
        return event_date;
    }

    public void setEventDate(LocalDate event_date) {
        this.event_date = event_date;
    }

    public LocalTime getEventTime() {
        return event_time;
    }

    public void setEventTime(LocalTime event_time) {
        this.event_time = event_time;
    }

}
