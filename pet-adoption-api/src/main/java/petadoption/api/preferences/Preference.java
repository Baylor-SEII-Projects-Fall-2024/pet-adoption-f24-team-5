package petadoption.api.preferences;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Entity
@Table(name = Preference.TABLE_NAME)
@Getter
@Setter
public class Preference {
    public static final String TABLE_NAME = "PREFERENCES";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "PREFERENCE_ID")
    private Long preferenceId;

    @Column(name = "PREFERRED_SPECIES")
    private String preferredSpecies;

    @Column(name = "PREFERRED_BREED")
    private String preferredBreed;

    @Column(name = "PREFERRED_COLOR")
    private String preferredColor;

    @Column(name = "PREFERRED_SEX")
    private String preferredSex;

    @Column(name = "PREFERRED_AGE")
    private int preferredAge;

    public Preference() {
    }

    public Preference(String preferredSpecies, String preferredBreed, String preferredColor, String preferredSex,
            int preferredAge) {
        this.preferredSpecies = preferredSpecies;
        this.preferredBreed = preferredBreed;
        this.preferredColor = preferredColor;
        this.preferredSex = preferredSex;
        this.preferredAge = preferredAge;
    }

    public Preference(Long preferenceId, String preferredSpecies, String preferredBreed, String preferredColor,
            String preferredSex, int preferredAge) {
        this.preferenceId = preferenceId;
        this.preferredSpecies = preferredSpecies;
        this.preferredBreed = preferredBreed;
        this.preferredColor = preferredColor;
        this.preferredSex = preferredSex;
        this.preferredAge = preferredAge;
    }
}
