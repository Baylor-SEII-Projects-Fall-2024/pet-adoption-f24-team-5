package petadoption.api.user;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

public class LoginController {
    @RequestMapping(value = "username", method = RequestMethod.GET)
    public String getUsername(
            @RequestParam(value = "username", defaultValue = "") String username) {
        return username;
    }
    @RequestMapping(value = "password", method = RequestMethod.GET)
    public String getPassword (
            @RequestParam(value = "password", defaultValue = "") String password) {
        return password;
    }
}
