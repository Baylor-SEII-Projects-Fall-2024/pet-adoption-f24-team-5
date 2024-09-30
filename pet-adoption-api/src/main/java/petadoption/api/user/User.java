package petadoption.api.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = User.TABLE_NAME)
@Getter
@Setter
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "USER_ID")
    protected Long id;

    @Column(name = "EMAIL_ADDRESS")
    protected  String emailAddress;

    @Column(name = "PASSWORD")
    protected String password;

    @Column(name = "USER_TYPE")
    @Enumerated(EnumType.STRING)
    protected UserType userType;

    @Column(name = "AGE")
    protected int age;

    @Column(name = "PHONE_NUMBER")
    protected String phoneNumber;

    public User() {

    }

    public User(String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.age = age;
        this.phoneNumber = phoneNumber;
    }
    public User(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        this.id = id;
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = userType;
        this.age = age;
        this.phoneNumber = phoneNumber;
    }


}
