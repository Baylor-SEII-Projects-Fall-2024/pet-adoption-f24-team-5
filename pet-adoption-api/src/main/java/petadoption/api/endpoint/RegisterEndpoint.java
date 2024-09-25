package petadoption.api.endpoint;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import petadoption.api.registration.RegisterService;

@Log4j2
@RestController
public class RegisterEndpoint {
    @Autowired
    private RegisterService registerService;
}
