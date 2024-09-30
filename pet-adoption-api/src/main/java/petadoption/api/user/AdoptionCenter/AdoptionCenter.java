package petadoption.api.user.AdoptionCenter;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import petadoption.api.user.User;

@Data
@Entity
@Table(name = User.TABLE_NAME)
@Getter
@Setter
public class AdoptionCenter {
    public static final String TABLE_NAME = "ADOPTION_CENTERS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "CENTER_ID")
    private Long id;

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

    public AdoptionCenter(String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
    }

    public AdoptionCenter(Long id, String centerName, String centerAddress, String centerCity, String centerState, String centerZip, int numberOfPets) {
        this.id = id;
        this.centerName = centerName;
        this.centerAddress = centerAddress;
        this.centerCity = centerCity;
        this.centerState = centerState;
        this.centerZip = centerZip;
        this.numberOfPets = numberOfPets;
    }
}
