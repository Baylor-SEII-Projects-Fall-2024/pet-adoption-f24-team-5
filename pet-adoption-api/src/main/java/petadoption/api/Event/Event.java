package petadoption.api.Event;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalTime;
import java.sql.Date;
import java.time.format.DateTimeFormatter;

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

    @Column(name = "CENTER_ID")
    protected Long center_id;

    @Column(name = "EVENT_NAME")
    protected String event_name;

    @Column(name = "EVENT_DATE")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    protected Date event_date;

    @Column(name = "EVENT_TIME")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "hh:mm a")
    protected LocalTime event_time;

    @Getter
    @Setter
    @Column(name = "DESCRIPTION")
    protected String description;

    public Event() {}

    public Event(Long center_id, String event_name, Date event_date, LocalTime event_time, String description) {
        this.center_id = center_id;
        this.event_name = event_name;
        this.event_date = event_date;
        this.event_time = event_time;
        this.description = description;

    }
    public Event(Long center_id, String event_name, String event_dateString, String event_timeString, String description) {
        this.center_id = center_id;
        this.event_name = event_name;
        this.event_date = Date.valueOf(LocalDate.parse(event_dateString, DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        this.event_time = LocalTime.parse(event_timeString, DateTimeFormatter.ofPattern("hh:mm a"));
        this.description = description;
    }
    public Event(Long event_id, Long center_id, String event_name, String event_dateString, String event_timeString, String description) {
        this.event_id = event_id;
        this.center_id = center_id;
        this.event_name = event_name;
        this.event_date = Date.valueOf(LocalDate.parse(event_dateString, DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        this.event_time = LocalTime.parse(event_timeString, DateTimeFormatter.ofPattern("hh:mm a"));
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

    public Date getEventDate() {
        return event_date;
    }

    public void setEventDate(Date event_date) {
        this.event_date = event_date;
    }

    public LocalTime getEventTime() {
        return event_time;
    }

    public void setEventTime(LocalTime event_time) {
        this.event_time = event_time;
    }

}
