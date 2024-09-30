package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;
import petadoption.api.user.UserType;


@Data
@Entity
@Table(name = User.TABLE_NAME)
@Getter
@Setter
public class CenterWorker extends User{
    public static final String TABLE_NAME = "CENTER_WORKERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "Worker_ID", unique = true, nullable = false)
    protected Long id;

    @Column(name = "USER_ID", unique = true, nullable = false)
    private Long userId;

    @Column(name = "CENTER_ID")
    private Long centerID;

    public CenterWorker(){
        super();
    }


    public CenterWorker(String emailAddress, String password, UserType userType, int age, String phoneNumber, Long userId) {
        super(emailAddress, password, userType, age, phoneNumber);
        this.userId = userId;
    }

    public CenterWorker(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber, Long userId) {
        super(id, emailAddress, password, userType, age, phoneNumber);
        this.userId = userId;
    }







}
