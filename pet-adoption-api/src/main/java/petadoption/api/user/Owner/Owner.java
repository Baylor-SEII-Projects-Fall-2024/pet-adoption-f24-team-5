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

    public Owner(){
        super();
    }
    public Owner(String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        super(emailAddress, password, userType, age, phoneNumber);
    }
    public Owner(String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(emailAddress, password, userType, age, phoneNumber);
        this.preference = preference;
    }

    public Owner(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber, Preference preference) {
        super(id, emailAddress, password, userType, age, phoneNumber);
        this.preference = preference;
    }
}
