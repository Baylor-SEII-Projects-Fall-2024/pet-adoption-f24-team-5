package petadoption.api.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> findUser(Long userId) {
        return userRepository.findById(userId);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public User loginUser(String email, String password) throws IllegalArgumentException {
        Optional<User> user = userRepository.findByEmailAddressAndPassword(email, password);
        if (user.isEmpty()) {
            throw new IllegalArgumentException("Invalid username or password");
        }
        return user.get();
    }

    public Long registerUser(User account) throws IllegalArgumentException{
        Optional<User> user = userRepository.findByEmailAddress(account.getEmailAddress());
        if (user.isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }
        userRepository.save(account);
        user = userRepository.findByEmailAddress(account.emailAddress);

        if(user.isEmpty()){
            throw new IllegalArgumentException("Error adding user");
        }
        return user.get().getId();
    }


}
