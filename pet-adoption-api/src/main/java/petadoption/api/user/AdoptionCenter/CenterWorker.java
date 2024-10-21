package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;
import petadoption.api.user.UserType;


@Getter
@Setter
@Entity
@DiscriminatorValue("CENTERWORKER")
@PrimaryKeyJoinColumn(name="USER_ID")
@EqualsAndHashCode(callSuper=true)
public class CenterWorker extends User{


    @Column(name = "CENTER_ID", nullable = true)
    private Long centerID;

    @Column(name = "AGE")
    private int age;



    public CenterWorker(){
        super();
        centerID = -1L;
    }

    public CenterWorker(String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber) {
        super(firstName, lastName, emailAddress, password, userType, phoneNumber);
        centerID = -1L;
        this.age = age;
    }


    public CenterWorker(String firstName, String lastName, String emailAddress, String password, UserType userType, int age, String phoneNumber, Long centerID) {
        super(firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.centerID = centerID;
        this.age = age;
    }

    public CenterWorker(String firstName, String lastName, Long id, String emailAddress, String password, UserType userType, int age, String phoneNumber, Long centerID) {
        super(id, firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.centerID = centerID;
        this.age = age;
    }







}
