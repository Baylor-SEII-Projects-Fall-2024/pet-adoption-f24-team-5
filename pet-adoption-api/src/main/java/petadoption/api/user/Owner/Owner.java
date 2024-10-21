package petadoption.api.user.Owner;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

@Getter
@Setter
@Entity
@DiscriminatorValue("OWNER")
@PrimaryKeyJoinColumn(name="USER_ID")
@EqualsAndHashCode(callSuper=true)
public class Owner extends User {

    @OneToOne
    @JoinColumn(name = "PREFERENCE_ID")
    private Preference preference;

    @Column(name = "AGE")
    private int age;

    @Column(name = "FIRST_NAME")
    protected String firstName;

    @Column(name = "LAST_NAME")
    protected String lastName;

    public Owner(){
        super();
    }
    public Owner(String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        super(emailAddress, password, userType, phoneNumber);
        this.age=age;
        this.firstName=firstName;
        this.lastName=lastName;
    }
    public Owner(String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(emailAddress, password, userType, phoneNumber);
        this.preference = preference;
        this.age=age;
        this.firstName=firstName;
        this.lastName=lastName;
    }

    public Owner(Long id, String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(id, emailAddress, password, userType, phoneNumber);
        this.preference = preference;
        this.age=age;
        this.firstName=firstName;
        this.lastName=lastName;
    }
}
