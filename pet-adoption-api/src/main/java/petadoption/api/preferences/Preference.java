package petadoption.api.preferences;

import jakarta.persistence.*;
import lombok.*;


@Data
@Entity
@Table(name = Preference.TABLE_NAME)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Preference {
    public static final String TABLE_NAME = "DEFAULT_PREFERENCES";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "DEFAULT_PREFERENCE_ID")
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

    public Preference(String preferredSpecies, String preferredBreed, String preferredColor, String preferredSex, int preferredAge) {
        this.preferredSpecies = preferredSpecies;
        this.preferredBreed = preferredBreed;
        this.preferredColor = preferredColor;
        this.preferredSex = preferredSex;
        this.preferredAge = preferredAge;
    }


}
