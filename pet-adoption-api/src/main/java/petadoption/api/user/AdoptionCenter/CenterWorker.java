package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;
import petadoption.api.user.UserType;


@Entity
@Getter
@Setter
public class CenterWorker extends User{

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "CENTER_ID", nullable = false)
    private AdoptionCenter adoptionCenter;

    public CenterWorker(){
        super();
    }
    public CenterWorker(String emailAddress, String password, UserType userType, int age, String phoneNumber, AdoptionCenter adoptionCenter) {
        super(emailAddress, password, userType, age, phoneNumber);
        this.adoptionCenter = adoptionCenter;
    }

    public CenterWorker(Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber, AdoptionCenter adoptionCenter) {
        super(id, emailAddress, password, userType, age, phoneNumber);
        this.adoptionCenter = adoptionCenter;
    }

}
