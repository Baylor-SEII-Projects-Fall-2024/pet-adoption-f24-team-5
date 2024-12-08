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

    public Optional<AdoptionCenter> findById(long id) {
        return adoptionCenterRepository.findById(id);
    }

    Optional<List<CenterWorker>> findAllCenterWorkers(long centerId) {
        return centerWorkerRepository.findAllByCenterID(centerId);
    }

    public void updatePetCount(long centerId, int petCount) {
        Optional<AdoptionCenter> tempCenter = adoptionCenterRepository.findById(centerId);
        if(tempCenter.isPresent()) {
            AdoptionCenter adoptionCenter = tempCenter.get();
            adoptionCenter.setNumberOfPets(petCount);
            adoptionCenterRepository.save(adoptionCenter);
        }
    }
    void deleteCenterWorker(long id) {
        centerWorkerRepository.deleteById(id);
    }

}
