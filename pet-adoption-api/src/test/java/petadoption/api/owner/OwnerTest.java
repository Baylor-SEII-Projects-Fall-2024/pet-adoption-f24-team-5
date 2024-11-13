package petadoption.api.owner;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.pet.Pet;
import petadoption.api.pet.PetRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.Owner.OwnerService;

import java.util.*;


public class OwnerTest {

    @Mock
    private OwnerRepository ownerRepository; // Mocking the repository

    @Mock
    private PetRepository petRepository;

    @InjectMocks
    private OwnerService ownerService; // The class under test

    @Mock
    private Owner owner;

    @Mock
    private Pet pet;

    @Mock
    private Pet pet1, pet2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void savePetForOwnerByEmail_Success() {
        String email = "test@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.of(owner));

        when(owner.getSavedPets()).thenReturn(new HashSet<>());
        when(petRepository.findByPetId(pet.getPetId())).thenReturn(Optional.of(pet));

        ownerService.savePetForOwnerByEmail(email, pet);

        verify(ownerRepository).save(owner);
        verify(owner).getSavedPets();

        assertTrue(owner.getSavedPets().contains(pet.getPetId()), "The pet should be saved in the owner's savedPets.");
    }

    @Test
    void savePetForOwnerByEmail_OwnerNotFound() {
        String email = "nonexistent@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.empty());
        when(petRepository.save(pet)).thenReturn(pet);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ownerService.savePetForOwnerByEmail(email, pet);
        });

        assertEquals("Owner not found", exception.getMessage());
    }

    @Test
    void getAllSavedPetsByEmail_Success() {
        String email = "test@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.of(owner));

        Set<Long> savedPetIds = new HashSet<>();
        savedPetIds.add(pet1.getPetId());
        savedPetIds.add(pet2.getPetId());

        when(owner.getSavedPets()).thenReturn(savedPetIds);

        List<Pet> pets = new ArrayList<>();
        pets.add(pet1);
        pets.add(pet2);

        when(petRepository.findByPetIdIn(savedPetIds)).thenReturn(Optional.of(pets));

        Optional<List<Pet>> result = ownerService.getAllSavedPetsByEmail(email);

        assertTrue(result.isPresent(), "Result should be present.");
        assertEquals(2, result.get().size(), "The set should contain 2 pets.");
        assertTrue(result.get().contains(pet1), "Pet 1 should be in the saved pets.");
        assertTrue(result.get().contains(pet2), "Pet 2 should be in the saved pets.");
    }

    @Test
    void getAllSavedPetsByEmail_OwnerNotFound() {
        String email = "nonexistent@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            ownerService.getAllSavedPetsByEmail(email);
        }, "Expected IllegalArgumentException when owner is not found.");
    }

    @Test
    void getAllSavedPetsByEmail_NoSavedPets() {
        String email = "test@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.of(owner));

        when(owner.getSavedPets()).thenReturn(new HashSet<>()); // Empty set

        when(petRepository.findByPetIdIn(Collections.emptyList())).thenReturn(Optional.empty());

        Optional<List<Pet>> result = ownerService.getAllSavedPetsByEmail(email);

        assertTrue(result.isPresent(), "Result should be present.");  // The result is present (not empty Optional)
        assertTrue(result.get().isEmpty(), "The list should be empty."); // The list inside the Optional should be empty
    }

}
