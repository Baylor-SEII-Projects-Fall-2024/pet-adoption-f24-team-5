package petadoption.api.user.Owner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

@Getter
@Setter
@Entity
@Table(name = User.TABLE_NAME)
public class Owner extends User {
    public static final String TABLE_NAME = "OWNERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "OWNER_ID", unique = true, nullable = false)
    private Long id;

    @Column(name = "USER_ID", unique = true, nullable = false)
    private Long userId;

    @Column(name = "PREFERENCE_ID", unique = true)
    private Long preferenceId;

    public Owner(){
        super();
    }

    public Owner(String emailAddress, String password, UserType userType, int age, String phoneNumber, Long preferenceId) {
        super(emailAddress, password, userType, age, phoneNumber);
        this.preferenceId = preferenceId;
    }

    public Owner(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber, Long preferenceId) {
        super(id, emailAddress, password, userType, age, phoneNumber);
        this.preferenceId = preferenceId;
    }
}
