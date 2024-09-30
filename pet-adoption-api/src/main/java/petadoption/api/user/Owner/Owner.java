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
public class Owner extends User {
    public static final String TABLE_NAME = "OWNERS";

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "PREFERENCE_ID", unique = true, nullable = false)
    private Preference preference;

    public Owner(){
        super();
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
