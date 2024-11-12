package petadoption.api.pet;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import petadoption.api.preferences.Preference;
import petadoption.api.recommendationEngine.RecommendationService;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PetWeightService {
    private final PetWeightRepository petWeightsRepository;
//    private final RecommendationService recommendationService;

    public long savePet(Pet pet, double[] petVector) {

        PetWeights petWeights = new PetWeights(petVector);
        PetWeights savedPetWeights = petWeightsRepository.save(petWeights);

        return  savedPetWeights.petWeightId;


    }
}
