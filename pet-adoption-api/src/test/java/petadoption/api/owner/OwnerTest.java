package petadoption.api.owner;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.pet.Pet;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.Owner.OwnerService;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@ActiveProfiles("testdb")
public class OwnerTest {

    @Mock
    private OwnerRepository ownerRepository; // Mocking the repository

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
        when(pet.getUsersWhoSaved()).thenReturn(new HashSet<>());

        ownerService.savePetForOwnerByEmail(email, pet);

        verify(ownerRepository).save(owner);
        verify(owner).getSavedPets();
        verify(pet).getUsersWhoSaved();

        assertTrue(owner.getSavedPets().contains(pet), "The pet should be saved in the owner's savedPets.");
        assertTrue(pet.getUsersWhoSaved().contains(owner), "The owner should be saved in the pet's usersWhoSaved.");
    }

    @Test
    void savePetForOwnerByEmail_OwnerNotFound() {
        String email = "nonexistent@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            ownerService.savePetForOwnerByEmail(email, pet);
        });

        assertEquals("Owner not found", exception.getMessage());
    }

    @Test
    void getAllSavedPetsByEmail_Success() {
        String email = "test@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.of(owner));

        Set<Pet> savedPets = new HashSet<>();
        savedPets.add(pet1);
        savedPets.add(pet2);
        when(owner.getSavedPets()).thenReturn(savedPets);

        Optional<Set<Pet>> result = ownerService.getAllSavedPetsByEmail(email);

        assertTrue(result.isPresent(), "Result should be present.");
        assertEquals(2, result.get().size(), "The set should contain 2 pets.");
        assertTrue(result.get().contains(pet1), "Pet 1 should be in the saved pets.");
        assertTrue(result.get().contains(pet2), "Pet 2 should be in the saved pets.");
    }

    @Test
    void getAllSavedPetsByEmail_OwnerNotFound() {
        String email = "nonexistent@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.empty());

        Optional<Set<Pet>> result = ownerService.getAllSavedPetsByEmail(email);

        assertFalse(result.isPresent(), "Result should be empty.");
    }

    @Test
    void getAllSavedPetsByEmail_NoSavedPets() {
        String email = "test@example.com";

        when(ownerRepository.findByEmailAddress(email)).thenReturn(Optional.of(owner));
        when(owner.getSavedPets()).thenReturn(new HashSet<>()); // Empty set

        Optional<Set<Pet>> result = ownerService.getAllSavedPetsByEmail(email);

        assertTrue(result.isPresent(), "Result should be present.");
        assertTrue(result.get().isEmpty(), "The set should be empty.");
    }
}
