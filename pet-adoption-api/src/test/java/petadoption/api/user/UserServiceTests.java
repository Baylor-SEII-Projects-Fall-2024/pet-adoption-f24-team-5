package petadoption.api.user;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void testSaveAndFindUserOwner() {
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
    void testSaveAndFindUserCenterWorker() {
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
    void testSaveAndFindUserAdoptionCenter() {
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

    @Test
    void testSaveEmptyUser() {
        User user = new User();
        User newUser = userService.saveUser(user);
        assertNotNull(newUser.id);
        assertEquals(newUser.id, user.id);
    }

    @Test
    void testGetDisplayName(){
        CenterWorker centerWorker = new CenterWorker();
        centerWorker.setUserType(UserType.CenterWorker);
        centerWorker.setEmailAddress("example@example.com");
        centerWorker.setPassword("password");
        centerWorker.setPhoneNumber("123-456-7890");
        centerWorker.setAge(21);
        centerWorker.setFirstName("John");
        centerWorker.setLastName("Doe");
        centerWorker.setCenterID(1L);

        userService.saveUser(centerWorker);
        assertEquals("John", userService.getDisplayName(centerWorker.getEmailAddress()));

        Owner owner = new Owner();
        owner.setUserType(UserType.Owner);
        owner.setEmailAddress("example2@example.com");
        owner.setPassword("password");
        owner.setPhoneNumber("123-456-7890");
        owner.setAge(21);
        owner.setFirstName("John");
        owner.setLastName("Doe");

        userService.saveUser(owner);
        assertEquals("John", userService.getDisplayName(owner.getEmailAddress()));

        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setUserType(UserType.CenterOwner);
        adoptionCenter.setEmailAddress("example3@example.com");
        adoptionCenter.setPassword("password");
        adoptionCenter.setPhoneNumber("123-456-7890");
        adoptionCenter.setCenterName("Center name");
        adoptionCenter.setCenterState("State name");
        adoptionCenter.setCenterZip("77777");
        adoptionCenter.setNumberOfPets(100);

        userService.saveUser(adoptionCenter);
        assertEquals("Center name", userService.getDisplayName(adoptionCenter.getEmailAddress()));
    }

    @Test
    void testEmptyDisplayname(){
        CenterWorker centerWorker = new CenterWorker();
        centerWorker.setUserType(UserType.CenterWorker);
        centerWorker.setEmailAddress("example@example.com");
        userService.saveUser(centerWorker);
        assertThrows(EntityNotFoundException.class, () -> userService.getDisplayName(centerWorker.getEmailAddress()));

        Owner owner = new Owner();
        owner.setUserType(UserType.Owner);
        owner.setEmailAddress("example2@example.com");
        userService.saveUser(owner);
        assertThrows(EntityNotFoundException.class, () -> userService.getDisplayName(owner.getEmailAddress()));

        AdoptionCenter adoptionCenter = new AdoptionCenter();
        adoptionCenter.setUserType(UserType.CenterOwner);
        adoptionCenter.setEmailAddress("example3@example.com");
        userService.saveUser(adoptionCenter);
        assertThrows(EntityNotFoundException.class, () -> userService.getDisplayName(adoptionCenter.getEmailAddress()));
    }

    @Test
    void testUpdateUserOwner(){
        Owner owner = new Owner();
        owner.setUserType(UserType.Owner);
        owner.setEmailAddress("example@example.com");
        owner.setPassword(passwordEncoder.encode("password"));
        owner.setPhoneNumber("123-456-7890");
        owner.setAge(21);
        owner.setFirstName("John");
        owner.setLastName("Doe");
        userService.saveUser(owner);

        Owner newOwner = new Owner();
        newOwner.setUserType(UserType.Owner);
        newOwner.setEmailAddress("bademail@example.com");
        newOwner.setPassword("newPassword");
        newOwner.setPhoneNumber("098-765-4321");
        newOwner.setAge(33);
        newOwner.setFirstName("Andrew");
        newOwner.setLastName("Parks");
        userService.saveUser(newOwner);

        assertNotEquals(userService.findUser("example@example.com"), userService.findUser("bademail@example.com"));

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateOwner(new Owner(), "password");
        });

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateOwner(owner, "newPassword");
        });

        Optional<?> optionalUpdatedUser = userService.findUser("example@example.com");
        assertTrue(optionalUpdatedUser.isPresent());
        Owner updatedOwner = (Owner) optionalUpdatedUser.get();
        updatedOwner.setAge(33);
        updatedOwner.setFirstName("Andrew");

        try{
            userService.updateOwner(updatedOwner, "password");
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getFirstName(), updatedOwner.getFirstName());
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getAge(), updatedOwner.getAge());
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getEmailAddress(), updatedOwner.getEmailAddress());
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getPassword(), updatedOwner.getPassword());
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getPhoneNumber(), updatedOwner.getPhoneNumber());
            assertEquals(((Owner)userService.findUser("example@example.com").get()).getLastName(), updatedOwner.getLastName());
        }
        catch(Exception e){
            fail();
        }
    }
}
