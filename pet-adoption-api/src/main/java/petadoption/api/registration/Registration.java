package petadoption.api.registration;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;

public class Registration {
    public static final String TABLE_NAME = "REGISTRATIONS";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "REGISTRATION_ID")
    Long registerID;

    @Column(name = "USER_ID")
    Long userID;

    public Registration(Long registerID, Long userID) {
        this.registerID = registerID;
        this.userID = userID;
    }
}
