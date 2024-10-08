package petadoption.api.pet;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.User;

@Entity
@Getter
@Setter
@Data
@Table(name = Pet.TABLE_NAME)
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
    @JoinColumn(name = "USER_ID")
    protected AdoptionCenter adoptionCenter;

    @Column(name = "SPECIES")
    protected String species;

    @Column(name = "PET_NAME")
    protected String petName;

    @Column(name = "BREED")
    protected String breed;

    @Column(name = "COLOR")
    protected String color;

    @Column(name = "AGE")
    protected Integer age;

    @Column(name = "ADOPTION_STATUS")
    protected Boolean adoptionStatus;

    @Column(name = "DESCRIPTION")
    protected String description;

    @Column(name = "IMAGE_DATA", length = 1000)
    private byte[] imageData;

    public Pet() { /*DEFAULT BRUTHA*/ }

    public Pet(String species, String petName, String breed, String color, Integer age, Boolean adoptionStatus, String description) {
        this.species = species;
        this.petName = petName;
        this.breed = breed;
        this.color = color;
        this.age = age;
        this.adoptionStatus = adoptionStatus;
        this.description = description;
    }

    public Pet(User owner, AdoptionCenter adoption, String species, String petName, String breed, String color, Integer age, Boolean adoptionStatus, String description, byte[] imageData) {
        this.petOwner = owner;
        this.adoptionCenter = adoption;
        this.species = species;
        this.petName = petName;
        this.breed = breed;
        this.color = color;
        this.age = age;
        this.adoptionStatus = adoptionStatus;
        this.description = description;
        this.imageData = imageData;
    }


}
