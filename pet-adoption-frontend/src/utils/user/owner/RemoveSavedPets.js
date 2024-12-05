import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const removeSavedPet = async (petToDelete, token, email) => {
    try {
        const response = await axios.delete(`${API_URL}/api/owner/remove_pet_user`, {
            params: { email },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                petId: petToDelete.petId,
                petOwner: petToDelete.petOwner,
                species: petToDelete.species,
                petName: petToDelete.petName,
                breed: petToDelete.breed,
                color: petToDelete.color,
                sex: petToDelete.sex,
                age: petToDelete.age,
                adoptionStatus: petToDelete.adoptionStatus,
                description: petToDelete.description,
                imageName: petToDelete.imageName,
                owner: petToDelete.owner,
                petWeightId: petToDelete.petWeightId
            },
        });
    } catch (error) {
        console.error('Error deleting pet:', error);
    }
};