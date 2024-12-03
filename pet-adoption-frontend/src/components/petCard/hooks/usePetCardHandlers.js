import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePetToOwner } from "@/utils/user/owner/savePetToOwner";
import { engineUpdatePreference } from "@/utils/recommendationEngine/engineUpdatePreference";
import { getUser } from "@/utils/user/getUser";
import { startConversation } from "@/utils/message/startConversation";

export const usePetCardHandlers = (pet, token, email, onLike) => {
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleSavePetToOwner = async () => {
        const formattedPet = {
            petId: pet.petId,
            petOwner: pet.petOwner,
            species: pet.species,
            petName: pet.petName,
            breed: pet.breed,
            color: pet.color,
            sex: pet.sex,
            age: pet.age,
            adoptionStatus: pet.adoptionStatus,
            description: pet.description,
            imageName: pet.imageName,
            owner: pet.owner,
            petWeightId: pet.petWeightId,
        };
        try {
            await savePetToOwner(token, formattedPet, email);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLikePet = async () => {
        const preference = {
            preferredSpecies: pet.species,
            preferredBreed: pet.breed,
            preferredColor: pet.color,
            preferredAge: pet.age,
        };
        try {
            await engineUpdatePreference(token, preference);
            if (onLike) onLike(pet);
        } catch (error) {
            console.error(error);
        }
    };

    const handleContactCenter = async () => {
        try {
            const userData = await getUser(token, email);
            const centerID = pet.adoptionCenter?.id;

            if (!centerID) {
                alert("Unable to contact the adoption center. Please try again later.");
                return;
            }

            await startConversation(token, userData.id, centerID);
            navigate("/Messages");
        } catch (error) {
            console.error("Failed to start conversation", error);
        }
    };

    return {
        loading,
        isHovered,
        isModalOpen,
        setLoading,
        setIsHovered,
        setIsModalOpen,
        handleSavePetToOwner,
        handleLikePet,
        handleContactCenter
    };
}; 