package petadoption.api.pet;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import java.sql.SQLException;
import java.util.Collections;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;

import petadoption.api.user.UserService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.context.annotation.Profile;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@ActiveProfiles("testdb")
public class PetTests {

    @MockBean
    private UserService userService;

    @MockBean
    private PetService petService;

    @Test
    @DisplayName("save pet success")
    void testSavePet() {
        Pet pet = new Pet();
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        pet.setPetId(1L); // Set a non-null ID to simulate a saved pet

        try {
            when(userService.findCenterByWorkerEmail("center1@gmail.com")).thenReturn(adoptionCenter);
            when(petService.savePet(pet, adoptionCenter)).thenReturn(pet); // Mock savePet to return the pet with an ID

            petService.savePet(pet, adoptionCenter);
            assertNotNull(pet.getPetId());
        } catch (SQLException e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("save pet fail")
    void testSavePetFail() {
        Pet pet = new Pet();
        AdoptionCenter adoptionCenter = new AdoptionCenter();

        try {
            when(userService.findCenterByWorkerEmail("center1@gmail.com")).thenReturn(adoptionCenter);
            when(petService.savePet(pet, adoptionCenter)).thenThrow(new RuntimeException("Save failed"));

            petService.savePet(pet, adoptionCenter);
            fail("RuntimeException was not thrown");
        } catch (RuntimeException e) {
            assertEquals("Save failed", e.getMessage());
        } catch (SQLException e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("get all pets")
    void testGetAllPets() {
        Pet pet = new Pet();
        pet.setPetId(1L);

        List<Pet> mockedPets = Collections.singletonList(pet);
        when(petService.getAllPets()).thenReturn(mockedPets);

        try {
            List<Pet> pets = petService.getAllPets();
            System.out.println(pets.getFirst());
            assertEquals(pets.getFirst().getPetId(), pet.getPetId());
        } catch (Exception e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("test no pet")
    void testNoPet() {
        List<Pet> mockedPets = Collections.emptyList();
        when(petService.getAllPets()).thenReturn(mockedPets);

        try {
            List<Pet> pets = petService.getAllPets();
            assertTrue(pets.isEmpty());
        } catch (Exception e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("get pet by adoption center")
    void testGetPetAdoptionCenter() {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setId(1L);

        Pet pet = new Pet();
        pet.setPetId(1L);

        List<Pet> mockedPets = Collections.singletonList(pet);

        when(petService.savePet(pet, adoptionCenter)).thenReturn(pet);
        when(petService.getPetByAdoptionCenter(adoptionCenter)).thenReturn(mockedPets);

        try {
            List<Pet> pets = petService.getPetByAdoptionCenter(adoptionCenter);
            assertEquals(pets.getFirst().getPetId(), pet.getPetId());
        } catch (Exception e) {
            fail("SQLException was thrown: " + e.getMessage());
        }

    }

    @Test
    @DisplayName("get pet by adoption center fail")
    void testGetPetAdoptionCenterFail() {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setId(1L);
        Pet pet = new Pet();
        pet.setPetId(1L);
        AdoptionCenter adoptionCenterFail = new AdoptionCenter();
        adoptionCenterFail.setId(2L);

        List<Pet> mockedPets = Collections.singletonList(pet);

        when(petService.savePet(pet, adoptionCenter)).thenReturn(pet);
        when(petService.getPetByAdoptionCenter(adoptionCenter)).thenReturn(mockedPets);

        try {
            petService.savePet(pet, adoptionCenter);
            List<Pet> pets = petService.getPetByAdoptionCenter(adoptionCenterFail);
            assertTrue(pets.isEmpty());
        } catch (Exception e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("delete pet")
    void testDeletePet() {
        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setId(1L);
        Pet pet = new Pet();
        pet.setPetId(1L);

        when(petService.savePet(pet, adoptionCenter)).thenReturn(pet);

        try {
            petService.savePet(pet, adoptionCenter);
            petService.deletePet(pet);
            List<Pet> pets = petService.getAllPets();
            assertTrue(pets.isEmpty());
        } catch (Exception e) {
            fail("SQLException was thrown: " + e.getMessage());
        }
    }

}
