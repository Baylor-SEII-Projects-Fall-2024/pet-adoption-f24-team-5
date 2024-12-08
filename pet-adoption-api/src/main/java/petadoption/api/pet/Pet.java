package petadoption.api.pet;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.User;
import petadoption.api.user.Owner.Owner;

@Entity
@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = Pet.TABLE_NAME)
//@JsonIgnoreProperties("adoptionCenter")
public class Pet {

    public static final String TABLE_NAME = "Pets";

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "PET_ID")
    protected Long petId;

    @ManyToOne
    @JoinColumn(name = "USER_ID")
    protected User petOwner;

    @ManyToOne
    @JoinColumn(name = "CENTER_ID", nullable = false)
    protected AdoptionCenter adoptionCenter;

    @Column(name = "SPECIES")
    protected String species;

    @Column(name = "PET_NAME")
    protected String petName;

    @Column(name = "BREED")
    protected String breed;

    @Column(name = "COLOR")
    protected String color;

    @Column(name = "SEX")
    protected String sex;

    @Column(name = "AGE")
    protected Integer age;

    @Column(name = "ADOPTION_STATUS")
    protected Boolean adoptionStatus;

    @Column(name = "DESCRIPTION")
    protected String description;

    @Column(name = "IMAGE_NAME", length = 1000)
    private String imageName;

    @ManyToOne
    @JoinColumn(name = "OWNER_ID")
    private Owner owner;

    public Pet(String species, String petName, String breed, String color, String sex, Integer age,
            Boolean adoptionStatus,
            String description) {
        this.species = species;
        this.petName = petName;
        this.breed = breed;
        this.color = color;
        this.sex = sex;
        this.age = age;
        this.adoptionStatus = adoptionStatus;
        this.description = description;
    }

    public Pet(String species, String petName, String breed, String color, String sex, Integer age,
            Boolean adoptionStatus,
            String description, String imageName) {
        this.species = species;
        this.petName = petName;
        this.breed = breed;
        this.color = color;
        this.sex = sex;
        this.age = age;
        this.adoptionStatus = adoptionStatus;
        this.description = description;
        this.imageName = imageName;
    }



    public Pet(String imageName) {
        this.imageName = imageName;
    }

}
