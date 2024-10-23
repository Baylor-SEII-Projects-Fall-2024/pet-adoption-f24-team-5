package petadoption.api.user.AdoptionCenter;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.user.UserService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdoptionCenterService {
    private final AdoptionCenterRepository adoptionCenterRepository;
    private final CenterWorkerRepository centerWorkerRepository;
    private final UserService userService;

    Optional<AdoptionCenter> findById(long id) {
        return adoptionCenterRepository.findById(id);
    }

    Optional<List<CenterWorker>> findAllCenterWorkers(long centerId) {
        return centerWorkerRepository.findAllByCenterID(centerId);
    }




}
