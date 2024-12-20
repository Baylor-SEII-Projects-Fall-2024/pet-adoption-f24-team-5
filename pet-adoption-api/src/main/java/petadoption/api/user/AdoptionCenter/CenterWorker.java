package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

@Getter
@Setter
@Entity
@DiscriminatorValue("CENTERWORKER")
@PrimaryKeyJoinColumn(name = "USER_ID")
@EqualsAndHashCode(callSuper = true)
public class CenterWorker extends User {

    @Column(name = "CENTER_ID", nullable = false)
    private Long centerID;

    @Column(name = "AGE")
    private int age;

    @Column(name = "FIRST_NAME")
    protected String firstName;

    @Column(name = "LAST_NAME")
    protected String lastName;

    public CenterWorker() {
        super();
        centerID = -1L;
    }

    /*
     * public CenterWorker(String firstName, String lastName, String emailAddress,
     * String password, UserType userType, int age, String phoneNumber) {
     * super(emailAddress, password, userType, phoneNumber);
     * centerID = -1L;
     * this.age = age;
     * this.firstName = firstName;
     * this.lastName = lastName;
     * }
     */

    public CenterWorker(String firstName, String lastName, String emailAddress, String password, UserType userType,
            int age, String phoneNumber, Long centerID) {
        super(emailAddress, password, userType, phoneNumber);
        this.centerID = centerID;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public CenterWorker(String firstName, String lastName, Long id, String emailAddress, String password,
            UserType userType, int age, String phoneNumber, Long centerID) {
        super(id, emailAddress, password, userType, phoneNumber);
        this.centerID = centerID;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
    }

}
