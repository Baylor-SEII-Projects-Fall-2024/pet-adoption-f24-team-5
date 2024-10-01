package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
@Data
@Entity
@Table(name = User.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "USER_TYPE", discriminatorType = DiscriminatorType.STRING)
public class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "USER_ID")
    protected Long id;

    @Column(name = "EMAIL_ADDRESS")
    protected  String emailAddress;

    @Column(name = "PASSWORD")
    protected String password;

    @Column(name = "ACCOUNT_TYPE")
    @Enumerated(EnumType.STRING)
    protected UserType userType;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    public User() {

    }

    public User(String emailAddress, String password, UserType userType, String phoneNumber) {
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.phoneNumber = phoneNumber;

    }
    public User(Long id, String emailAddress, String password, UserType userType, String phoneNumber) {
        this.id = id;
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.phoneNumber = phoneNumber;

    }


}
