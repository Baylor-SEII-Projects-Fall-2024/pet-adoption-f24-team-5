package petadoption.api.user.Owner;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import petadoption.api.preferences.Preference;
import petadoption.api.user.User;

@Getter
@Setter
@Entity
@Table(name = SeenPets.TABLE_NAME)
@RequiredArgsConstructor
public class SeenPets {

    public static final String TABLE_NAME = "seen_pets";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "Seen_ID")
    private long seenID;

    @Column(name = "SEEN_PET_ID")
    private long seenPetId;

    @Column(name = "OWNER_ID")
    private long ownerId;


    public SeenPets(long seenID, long seenPetId, long ownerId) {
        this.seenID = seenID;
        this.seenPetId = seenPetId;
        this.ownerId = ownerId;
    }


}
