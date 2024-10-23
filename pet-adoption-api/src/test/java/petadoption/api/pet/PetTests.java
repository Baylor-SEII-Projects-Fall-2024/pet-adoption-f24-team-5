package petadoption.api.pet;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.fail;
import static org.mockito.Mockito.when;

import java.sql.SQLException;

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
}
