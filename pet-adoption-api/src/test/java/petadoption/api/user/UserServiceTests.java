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

import javax.swing.text.html.Option;
import java.sql.SQLException;
import java.util.List;
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
    @Autowired
    private UserRepository userRepository;

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
    void testEmptyDisplayName(){
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

    @Test
    void testUpdateUserCenterWorker(){
        CenterWorker worker = new CenterWorker();
        worker.setUserType(UserType.CenterWorker);
        worker.setEmailAddress("example@example.com");
        worker.setPassword(passwordEncoder.encode("password"));
        worker.setPhoneNumber("123-456-7890");
        worker.setAge(21);
        worker.setFirstName("John");
        worker.setLastName("Doe");
        userService.saveUser(worker);

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateCenterWorker(new CenterWorker(), "password");
        });

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateCenterWorker(worker, "newPassword");
        });

        Optional<?> optionalUpdatedUser = userService.findUser("example@example.com");
        assertTrue(optionalUpdatedUser.isPresent());
        CenterWorker updatedCenterWorker = (CenterWorker) optionalUpdatedUser.get();
        updatedCenterWorker.setAge(33);
        updatedCenterWorker.setFirstName("Andrew");

        try{
            userService.updateCenterWorker(updatedCenterWorker, "password");
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getFirstName(), updatedCenterWorker.getFirstName());
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getAge(), updatedCenterWorker.getAge());
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getEmailAddress(), updatedCenterWorker.getEmailAddress());
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getPassword(), updatedCenterWorker.getPassword());
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getPhoneNumber(), updatedCenterWorker.getPhoneNumber());
            assertEquals(((CenterWorker)userService.findUser("example@example.com").get()).getLastName(), updatedCenterWorker.getLastName());
        }
        catch(Exception e){
            fail();
        }
    }

    @Test
    void testUpdateUserCenterOwner(){
        AdoptionCenter center = new AdoptionCenter();
        center.setEmailAddress("example@gmail.com");
        center.setPassword(passwordEncoder.encode("password"));
        center.setUserType(UserType.CenterOwner);
        center.setPhoneNumber("254-556-7794");
        center.setCenterAddress("Andrew Boulevard");
        center.setCenterName("Adoption Center");
        center.setCenterCity("Plano");
        center.setCenterState("Oregon");
        center.setCenterZip("12345");
        center.setNumberOfPets(100);
        userService.saveUser(center);

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateAdoptionCenter(new AdoptionCenter(), "password");
        });

        assertThrowsExactly(IllegalAccessException.class, () -> {
            userService.updateAdoptionCenter(center, "newPassword");
        });

        Optional<?> optionalUpdatedUser = userService.findUser("example@gmail.com");
        assertTrue(optionalUpdatedUser.isPresent());
        AdoptionCenter updatedAdoptionCenter = (AdoptionCenter) optionalUpdatedUser.get();
        updatedAdoptionCenter.setCenterName("NEW CENTER NAME");
        updatedAdoptionCenter.setCenterCity("Waco");

        try{
            userService.updateAdoptionCenter(updatedAdoptionCenter, "password");
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getCenterZip(), updatedAdoptionCenter.getCenterZip());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getCenterState(), updatedAdoptionCenter.getCenterState());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getEmailAddress(), updatedAdoptionCenter.getEmailAddress());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getPassword(), updatedAdoptionCenter.getPassword());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getPhoneNumber(), updatedAdoptionCenter.getPhoneNumber());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getCenterAddress(), updatedAdoptionCenter.getCenterAddress());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getNumberOfPets(), updatedAdoptionCenter.getNumberOfPets());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getCenterName(), updatedAdoptionCenter.getCenterName());
            assertEquals(((AdoptionCenter)userService.findUser("example@gmail.com").get()).getCenterCity(), updatedAdoptionCenter.getCenterCity());
        }
        catch(Exception e){
            fail();
        }
    }

    @Test
    void testFindAllAdoptionCenters() {
        userRepository.deleteAll();
        assertEquals(0, userService.findAllAdoptionCenters().size());
        AdoptionCenter center = new AdoptionCenter();
        center.setEmailAddress("example@gmail.com");
        center.setPassword(passwordEncoder.encode("password"));
        center.setUserType(UserType.CenterOwner);
        center.setPhoneNumber("254-556-7794");
        center.setCenterAddress("Andrew Boulevard");
        center.setCenterName("Adoption Center");
        center.setCenterCity("Plano");
        center.setCenterState("Oregon");
        center.setCenterZip("12345");
        center.setNumberOfPets(100);

        userService.saveUser(center);
        assertEquals(1, userService.findAllAdoptionCenters().size());
        assertEquals(center, userService.findAllAdoptionCenters().get(0));

        AdoptionCenter center2 = new AdoptionCenter();
        center2.setEmailAddress("example@example.com");
        center2.setPassword(passwordEncoder.encode("password"));
        center2.setUserType(UserType.CenterOwner);
        center2.setPhoneNumber("254-556-7794");
        center2.setCenterAddress("Andrew Boulevard");
        center2.setCenterName("Adoption Center");
        center2.setCenterCity("Plano");
        center2.setCenterState("Oregon");
        center2.setCenterZip("12345");
        center2.setNumberOfPets(100);

        userService.saveUser(center2);
        assertEquals(2, userService.findAllAdoptionCenters().size());
        assertEquals(center, userService.findAllAdoptionCenters().get(0));
        assertEquals(center2, userService.findAllAdoptionCenters().get(1));

        AdoptionCenter center3 = new AdoptionCenter();
        userService.saveUser(center3);
        AdoptionCenter center4 = new AdoptionCenter();
        userService.saveUser(center4);
        AdoptionCenter center5 = new AdoptionCenter();
        userService.saveUser(center5);
        assertEquals(5, userService.findAllAdoptionCenters().size());
    }

    @Test
    void testFindCenterByWorkerEmail() {
        assertThrowsExactly(SQLException.class, () -> {
            userService.findCenterByWorkerEmail("example@example.com");
        });

        assertThrowsExactly(IllegalArgumentException.class, () -> {
            userService.findCenterByWorkerEmail("");
        });

        AdoptionCenter center = new AdoptionCenter();
        center.setEmailAddress("center@example.com");
        center.setPassword(passwordEncoder.encode("password"));
        center.setUserType(UserType.CenterOwner);
        center.setPhoneNumber("254-556-7794");
        center.setCenterAddress("Andrew Boulevard");
        center.setCenterName("Adoption Center");
        center.setCenterCity("Plano");
        center.setCenterState("Oregon");
        center.setCenterZip("12345");
        center.setNumberOfPets(100);
        userService.saveUser(center);

        try {
            assertEquals(center, userService.findCenterByWorkerEmail("example@example.com"));
        }
        catch (Exception e) {
            assertTrue(true);
        }

        CenterWorker centerWorker = new CenterWorker();
        centerWorker.setEmailAddress("example@example.com");
        centerWorker.setPassword(passwordEncoder.encode("password"));
        centerWorker.setPhoneNumber("254-556-7794");
        centerWorker.setLastName("Adoption Center");
        centerWorker.setFirstName("Example");
        centerWorker.setUserType(UserType.CenterWorker);
        centerWorker.setAge(21);
        centerWorker.setCenterID(center.getId());
        userService.saveUser(centerWorker);

        assertEquals(center.getId(), ((AdoptionCenter)userService.findUser("center@example.com").get()).getId());
        assertEquals(centerWorker.getId(), ((CenterWorker)userService.findUser("example@example.com").get()).getId());
        assertEquals(centerWorker.getCenterID(), ((CenterWorker)userService.findUser("example@example.com").get()).getCenterID());

        try {
            assertEquals(center, userService.findCenterByWorkerEmail("example@example.com"));
        }
        catch (Exception e) {
            fail();
        }
    }

    @Test
    void testUserCreate() {
        User newUser = new Owner();
        newUser.setUserType(UserType.Owner);
        newUser.setEmailAddress("example@example.com");
        newUser.setPassword("password");

        User savedUser = userService.saveUser(newUser);
        assertNotNull(savedUser.getId());

        Optional<?> optionalFoundUser = userService.findUser(savedUser.getEmailAddress());
        assertTrue(optionalFoundUser.isPresent());
        User foundUser = (User) optionalFoundUser.get();

        assertEquals(newUser.getUserType(), foundUser.getUserType());
        assertEquals(newUser.getEmailAddress(), foundUser.getEmailAddress());
        assertEquals(newUser.getPassword(), foundUser.getPassword());
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
        Optional<?> optionalUserBeforeDeletion = userService.findUser(savedUser.getEmailAddress());
        assertTrue(optionalUserBeforeDeletion.isPresent());
        User userBeforeDeletion = (User) optionalUserBeforeDeletion.get();

        // Delete the user
        userService.deleteUser(savedUser.getId());

        // Check if the user is deleted
        if (userService.findUser(userBeforeDeletion.getEmailAddress()).isPresent()) {
            fail();
        }
    }

    @Test
    void testFindAllUsers() {
        List<User> users = userService.findAllUsers();
        assertEquals(8, users.size());
    }
}
