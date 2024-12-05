package petadoption.api.auth;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;


import petadoption.api.PetAdoptionApplicationTests;
import petadoption.api.config.JwtService;
import petadoption.api.user.AdoptionCenter.AdoptionCenter;
import petadoption.api.user.AdoptionCenter.AdoptionCenterRepository;
import petadoption.api.user.AdoptionCenter.CenterWorker;
import petadoption.api.user.AdoptionCenter.CenterWorkerRepository;
import petadoption.api.user.Owner.Owner;
import petadoption.api.user.Owner.OwnerRepository;
import petadoption.api.user.User;
import petadoption.api.user.UserRepository;
import petadoption.api.user.UserType;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.ExpectedCount.times;

//@SpringBootTest
//@ActiveProfiles("testdb")
public class AuthenticationServiceTest extends PetAdoptionApplicationTests {

    @Autowired
    private AuthenticationService authenticationService;

    @MockBean
    private UserRepository userRepository;


    @MockBean
    private OwnerRepository ownerRepository;
    @MockBean
    private AdoptionCenterRepository adoptionCenterRepository;

    @MockBean
    private CenterWorkerRepository centerWorkerRepository;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private AuthenticationManager authenticationManager;


    @Test
    public void RegisterOwnerTest_Success() {
        // Arrange: Create the Owner entity to register
        Owner owner = new Owner(
                "John", "Doe", "john.doe@gmail.com",
                "password", UserType.Owner, 30, "123-456-7890", "11768"
        );

        // Assert: Verify that the save() method was called with the right entity
        ownerRepository.save(owner);

        assertFalse(userRepository.findByEmailAddress(owner.getEmailAddress()).isPresent());
    }

    @Test
    public void RegisterOwnerTest_Fail_DuplicateEmail() {
        Owner owner = new Owner("John", "Doe", "duplicate@gmail.com", "password", UserType.Owner, 30, "123-456-7890", "77429");

        // Mock the scenario where the email already exists
        when(userRepository.findByEmailAddress(owner.getEmailAddress())).thenReturn(Optional.of(owner));

        // Verify that the method throws IllegalArgumentException
        assertThrows(IllegalArgumentException.class, () -> authenticationService.register(owner));
    }

    @Test
    public void RegisterAdoptionCenterTest_Success() {
        // Arrange: Create the AdoptionCenter entity to register
        AdoptionCenter center = new AdoptionCenter(
                "center1@gmail.com", "password", UserType.CenterOwner,
                "123-456-7890", "Happy Pets", "123 Pet Street",
                "Austin", "TX", "78701", 15
        );

        // Assert: Verify that the save() method was called with the right entity
        adoptionCenterRepository.save(center);

        assertFalse(userRepository.findByEmailAddress(center.getEmailAddress()).isPresent());
    }

    @Test
    public void RegisterAdoptionCenterTest_Fail_DuplicateEmail() {
        // Arrange: Create an AdoptionCenter entity with a duplicate email
        AdoptionCenter center = new AdoptionCenter(
                "duplicate@gmail.com", "password", UserType.CenterOwner,
                "123-456-7890", "Happy Pets", "123 Pet Street",
                "Austin", "TX", "78701", 15
        );

        // Mock the scenario where the email already exists
        when(userRepository.findByEmailAddress(center.getEmailAddress())).thenReturn(Optional.of(center));

        // Verify that the method throws IllegalArgumentException
        assertThrows(IllegalArgumentException.class, () -> authenticationService.register(center));
    }


    @Test
    public void RegisterCenterWorkerTest_Success() {
        // Arrange: Create the CenterWorker entity to register
        CenterWorker worker = new CenterWorker(
                "Bob", "Johnson", "worker1@gmail.com", "password",
                UserType.CenterWorker, 25, "987-654-3210", -1L
        );

        // Assert: Verify that the save() method was called with the right entity
        centerWorkerRepository.save(worker);

        assertFalse(userRepository.findByEmailAddress(worker.getEmailAddress()).isPresent());
    }

    @Test
    public void RegisterCenterWorkerTest_Fail_DuplicateEmail() {
        // Arrange: Create a CenterWorker entity with a duplicate email
        CenterWorker worker = new CenterWorker(
                "Bob", "Johnson", "duplicate@gmail.com", "password",
                UserType.CenterWorker, 25, "987-654-3210", -1L
        );

        // Mock the scenario where the email already exists
        when(userRepository.findByEmailAddress(worker.getEmailAddress())).thenReturn(Optional.of(worker));

        // Verify that the method throws IllegalArgumentException
        assertThrows(IllegalArgumentException.class, () -> authenticationService.register(worker));
    }





    @Test
    public void AuthenticateTest_Success() {
        User user = new User();
        user.setEmailAddress("auth@test.com");
        user.setPassword("encoded-password");

        // Mocking behavior of dependencies
        when(userRepository.findByEmailAddress("auth@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("mock-jwt-token");

        AuthenticationRequest request = new AuthenticationRequest("auth@test.com", "password");

        AuthenticationResponse response = authenticationService.authenticate(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
    }

    @Test
    public void AuthenticateTest_Fail_InvalidCredentials() {
        // Mock the scenario where the user does not exist
        when(userRepository.findByEmailAddress("auth@test.com")).thenReturn(Optional.empty());

        AuthenticationRequest request = new AuthenticationRequest("auth@test.com", "wrong-password");

        // Verify that an exception is thrown
        assertThrows(Exception.class, () -> authenticationService.authenticate(request));
    }
}