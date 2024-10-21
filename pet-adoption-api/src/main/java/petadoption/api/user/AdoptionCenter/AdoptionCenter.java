package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.*;
import petadoption.api.user.User;
import petadoption.api.user.UserType;

@Data
@Entity
@Getter
@Setter
@DiscriminatorValue("CENTEROWNER")
@PrimaryKeyJoinColumn(name="USER_ID")
@EqualsAndHashCode(callSuper=true)
public class AdoptionCenter extends User {

    @Column(name = "CENTER_NAME")
    private String centerName;

    @Column(name = "CENTER_ADDRESS")
    private String centerAddress;

    @Column(name = "CENTER_CITY")
    private String centerCity;

    @Column(name = "CENTER_STATE")
    private String centerState;

    @Column(name = "CENTER_ZIP")
    private String centerZip;

    @Column(name = "CENTER_PET_COUNT")
    private int numberOfPets;

    public AdoptionCenter() {
    }

    public AdoptionCenter(String firstName, String lastName, String emailAddress, String password, UserType userType, String phoneNumber,
                          String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        super(firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
    }

    public AdoptionCenter(Long id, String firstName, String lastName, String emailAddress, String password, UserType userType, String phoneNumber,
                          String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        super(id, firstName, lastName, emailAddress, password, userType, phoneNumber);
        this.id = id;
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
    }
}



