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
public class User {
    public static final String TABLE_NAME = "USERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "USER_ID")
    Long id;

    @Column(name = "EMAIL_ADDRESS")
    String emailAddress;

    @Column(name = "PASSWORD")
    String password;

    @Column(name = "USER_TYPE")
    String userType;

    @Column(name = "AGE")
    int age;

    @Column(name = "PHONE_NUMBER")
    String phoneNumber;

    public User() {

    }

    public User(String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = String.valueOf(userType);
        this.age = age;
        this.phoneNumber = phoneNumber;
    }
    public User(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        this.id = id;
        this.emailAddress = emailAddress;
        this.password = password;
        this.userType = String.valueOf(userType);
        this.age = age;
        this.phoneNumber = phoneNumber;
    }


}
