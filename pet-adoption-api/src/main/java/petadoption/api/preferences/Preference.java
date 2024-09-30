package petadoption.api.preferences;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.user.User;

@Data
@Entity
@Table(name = User.TABLE_NAME)
@Getter
@Setter
public class Preference {
    public static final String TABLE_NAME = "PREFERENCES";

    @Id
    @GeneratedValue(generator = TABLE_NAME + "_GENERATOR")
    @SequenceGenerator(
            name = TABLE_NAME + "_GENERATOR",
            sequenceName = TABLE_NAME + "_SEQUENCE"
    )
    @Column(name = "PREFERENCE_ID")
    private Long id;

    @Column(name = "PREFERRED_SPECIES")
    private String preferredSpecies;

    @Column(name = "PREFERRED_BREED")
    private String preferredBreed;

    @Column(name = "PREFERRED_COLOR")
    private String preferredColor;

    @Column(name = "PREFERRED_AGE")
    private int preferredAge;

    public Preference() {
    }

    public Preference(String preferredSpecies, String preferredBreed, String preferredColor, int preferredAge) {
        this.preferredSpecies = preferredSpecies;
        this.preferredBreed = preferredBreed;
        this.preferredColor = preferredColor;
        this.preferredAge = preferredAge;
    }

    public Preference(Long id, String preferredSpecies, String preferredBreed, String preferredColor, int preferredAge) {
        this.id = id;
        this.preferredSpecies = preferredSpecies;
        this.preferredBreed = preferredBreed;
        this.preferredColor = preferredColor;
        this.preferredAge = preferredAge;
    }
}
