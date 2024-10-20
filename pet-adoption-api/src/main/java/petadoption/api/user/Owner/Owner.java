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

    public Owner(){
        super();
    }
    public Owner(String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        super(firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.age=age;
    }
    public Owner(String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.preference = preference;
        this.age=age;
    }

    public Owner(Long id, String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(id, firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.preference = preference;
        this.age=age;
    }
}
