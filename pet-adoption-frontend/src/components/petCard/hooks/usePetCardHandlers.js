import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { savePetToOwner } from "@/utils/user/owner/savePetToOwner";
import { engineUpdatePreference } from "@/utils/recommendationEngine/engineUpdatePreference";
import { getUser } from "@/utils/user/getUser";
import { startConversation } from "@/utils/message/startConversation";
import {API_URL} from "@/constants";
import axios from "axios";

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

    const fetchUser = async () => {
        try {
            const url = `${API_URL}/api/users/getUser?emailAddress=${email}`;
            const response = await axios.get(url, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch user", error);
            throw error;
        }
    };

    const handleContactCenter = async () => {
        console.log("Pet data:", pet);
        try {
            // Fetch user data to get userId
            const userData = await fetchUser();
            const userId = userData.id;

            // Retrieve centerID from the adoptionCenter field
            const centerID = pet.adoptionCenter?.id;

            if (!centerID) {
                console.error("Center ID not found in pet data");
                alert("Unable to contact the adoption center. Please try again later.");
                return;
            }

            const startConversationUrl = `${API_URL}/api/conversation/startConversation`;

            // Start the conversation
            const conversationResponse = await axios.post(
                startConversationUrl,
                null,
                {
                    params: {
                        petOwnerID: userId,
                        centerID: centerID,
                    },
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const conversation = conversationResponse.data;
            console.log("Conversation started:", conversation);

            // Send a message with the current PetCard's data
            const sendMessageUrl = `${API_URL}/api/message/sendMessage`;
            const petDataMessage = `PETCARD_JSON:${JSON.stringify(pet)}`;
            console.log(petDataMessage);

            const messageResponse = await axios.post(
                sendMessageUrl,
                {
                    conversationId: conversation.conversationId,
                    senderId: userId,
                    receiverId: centerID,
                    message: petDataMessage,
                    //message: "Hello World",
                    isRead: false,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Message sent:", messageResponse.data);

            // Navigate to the Messages page
            navigate("/Messages");
        } catch (error) {
            console.error("Failed to contact adoption center", error);
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