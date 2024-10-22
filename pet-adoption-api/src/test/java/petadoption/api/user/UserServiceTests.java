package petadoption.api.user;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.Owner.Owner;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("testdb") // make these tests use the H2 in-memory DB instead of your actual DB
@Transactional // make these tests revert their DB changes after the test is complete
public class UserServiceTests {
    @Autowired
    private UserService userService;

    @Test
    void testFindUserOwner() {
        User newUser = new Owner();
        newUser.setUserType(UserType.Owner);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");
        newUser.setPhoneNumber("123-456-7890");
        ((Owner)newUser).setAge(21);
        ((Owner)newUser).setFirstName("John");
        ((Owner)newUser).setLastName("Doe");

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);

        Optional<?> foundUserOpt = userService.findUser(savedUser.getEmailAddress());
        assertTrue(foundUserOpt.isPresent());
        User foundUser = (User)foundUserOpt.get();

        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
        assertEquals(newUser.getPhoneNumber(), foundUser.getPhoneNumber());
        assertEquals(((Owner)newUser).getAge(), ((Owner)savedUser).getAge());
        assertEquals(((Owner)newUser).getFirstName(), ((Owner)savedUser).getFirstName());
        assertEquals(((Owner)newUser).getLastName(), ((Owner)savedUser).getLastName());
    }

    @Test
    void testFindUserCenterWorker() {
        User newUser = new CenterWorker();
        newUser.setUserType(UserType.CenterWorker);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");
        newUser.setPhoneNumber("123-456-7890");
        ((CenterWorker)newUser).setAge(21);
        ((CenterWorker)newUser).setFirstName("John");
        ((CenterWorker)newUser).setLastName("Doe");
        ((CenterWorker)newUser).setCenterID((long)1);

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);
        Optional<?> foundUserOpt = userService.findUser(savedUser.getEmailAddress());

        assertTrue(foundUserOpt.isPresent());
        User foundUser = (User)foundUserOpt.get();
        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
        assertEquals(newUser.getPhoneNumber(), foundUser.getPhoneNumber());
        assertEquals(((CenterWorker)newUser).getAge(), ((CenterWorker)savedUser).getAge());
        assertEquals(((CenterWorker)newUser).getFirstName(), ((CenterWorker)savedUser).getFirstName());
        assertEquals(((CenterWorker)newUser).getLastName(), ((CenterWorker)savedUser).getLastName());
        assertEquals(((CenterWorker)newUser).getCenterID(), ((CenterWorker)savedUser).getCenterID());
    }

    @Test
    void testFindUserAdoptionCenter() {
        User newUser = new AdoptionCenter();
        newUser.setUserType(UserType.CenterOwner);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");
        newUser.setPhoneNumber("123-456-7890");
        ((AdoptionCenter)newUser).setCenterCity("Waco");
        ((AdoptionCenter)newUser).setCenterAddress("1111 Bear Ave");
        ((AdoptionCenter)newUser).setCenterName("Andrew's Place");
        ((AdoptionCenter)newUser).setCenterState("Texas");
        ((AdoptionCenter)newUser).setCenterZip("77777");
        ((AdoptionCenter)newUser).setNumberOfPets(100);

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.id);
        Optional<?> foundUserOpt = userService.findUser(savedUser.getEmailAddress());
        assertTrue(foundUserOpt.isPresent());
        User foundUser = (User)foundUserOpt.get();

        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
        assertEquals(newUser.getPhoneNumber(), foundUser.getPhoneNumber());
        assertEquals(((AdoptionCenter) newUser).getCenterName(), ((AdoptionCenter) foundUser).getCenterName());
        assertEquals(((AdoptionCenter)newUser).getCenterState(), ((AdoptionCenter) foundUser).getCenterState());
        assertEquals(((AdoptionCenter)newUser).getCenterZip(), ((AdoptionCenter) foundUser).getCenterZip());
        assertEquals(((AdoptionCenter)newUser).getNumberOfPets(), ((AdoptionCenter) foundUser).getNumberOfPets());
        assertEquals(((AdoptionCenter)newUser).getCenterAddress(), ((AdoptionCenter) foundUser).getCenterAddress());
        assertEquals(((AdoptionCenter)newUser).getCenterCity(), ((AdoptionCenter) foundUser).getCenterCity());
    }

    @Test
    void testFindEmptyUser() {
        Optional<?> newUser = userService.findUser("example@example.com");
        assertTrue(newUser.isEmpty());
    }
}
