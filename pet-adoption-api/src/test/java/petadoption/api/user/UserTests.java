package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.user.Owner.Owner;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class UserTests {
    @Autowired
    private UserService userService;

    @Test
    void testUserCreate() {
        User newUser = new Owner();
        newUser.setUserType(UserType.Owner);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.getId());

        User foundUser = userService.findUser(savedUser.getEmailAddress());
        assertNotNull(foundUser);

        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
    }

    @Test
    void testUserFind() {
        /*
         * Optional<User> user1 = userService.findUser(1L);
         * assertTrue(user1.isEmpty());
         */
    }

    @Test
    void testDeleteUser() {
        // Create and save a user to ensure it exists before deletion
        User newUser = new Owner();
        newUser.setUserType(UserType.Owner);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");
        User savedUser = userService.saveUser(newUser);

        // Ensure the user exists before deletion
        User userBeforeDeletion = userService.findUser(savedUser.getEmailAddress());
        assertNotNull(userBeforeDeletion, "User should exist before deletion");

        // Delete the user
        userService.deleteUser(savedUser.getId());

        // Check if the user is deleted

        assertThrows(Exception.class, () -> {
            userService.findUser(savedUser.getEmailAddress());
        });
    }

    @Test
    void testFindAllUsers() {
        List<User> users = userService.findAllUsers();
        assertEquals(6, users.size());
    }
}
