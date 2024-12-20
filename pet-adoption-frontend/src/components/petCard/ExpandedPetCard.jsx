import React, { useState } from 'react';
import { Modal, Typography, Button, Divider, Fade, Box, Tooltip, IconButton, Backdrop, CircularProgress } from '@mui/material';
import ImageComponent from '../imageComponent/ImageComponent';
import { useSelector } from 'react-redux';
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";
import { savePetToOwner } from '@/utils/user/owner/savePetToOwner';
import { engineUpdatePreference } from '@/utils/recommendationEngine/engineUpdatePreference';
import {
    ModalContainer,
    ImageSection,
    ContentSection,
    PetDetails,
    ActionSection,
    DetailItem,
    ImageControls,
    ContentWrapper
} from './styles/ExpandedPetCard.styles';
import {
    Pets,
    Cake,
    Male,
    Female,
    Category,
    Close,
    Favorite,
    BookmarkAdd,
    ZoomIn,
    ZoomOut,
    Message as MessageIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import or define your API_URL constant
import { API_URL } from '@/constants';

const ExpandedPetCard = ({ pet, onClose, saveable = true, likeable = true, contactable = true, onLike = null }) => {
    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);
    const [imageZoom, setImageZoom] = useState(false);
    const navigate = useNavigate();

    if (!pet) return null;

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
            console.error("Failed to save pet to owner:", error);
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
            console.error("Failed to like pet:", error);
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

            const messageResponse = await axios.post(
                sendMessageUrl,
                {
                    conversationId: conversation.conversationId,
                    senderId: userId,
                    receiverId: centerID,
                    message: petDataMessage,
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

    return (
        <Modal
            open={!!pet}
            onClose={onClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }
                }
            }}
        >
            <Fade
                in={!!pet}
                timeout={300}
                style={{
                    transitionDelay: '100ms'
                }}
            >
                <ModalContainer>
                    <ImageSection>
                        <ImageComponent
                            imageName={pet.imageName}
                            width="100%"
                            height="100%"
                            style={{
                                transform: imageZoom ? 'scale(1.5)' : 'scale(1)',
                                transition: 'all 0.3s ease',
                            }}
                            onClick={() => setImageZoom(!imageZoom)}
                        />
                        <ImageControls>
                            <Tooltip title={imageZoom ? "Zoom Out" : "Zoom In"}>
                                <IconButton
                                    onClick={() => setImageZoom(!imageZoom)}
                                    size="small"
                                >
                                    {imageZoom ? <ZoomOut /> : <ZoomIn />}
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Close">
                                <IconButton
                                    onClick={onClose}
                                    size="small"
                                >
                                    <Close />
                                </IconButton>
                            </Tooltip>
                        </ImageControls>
                    </ImageSection>

                    <ContentWrapper>
                        <ContentSection>
                            <PetDetails>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: 'text.primary',
                                        mb: 1
                                    }}
                                >
                                    {pet.petName}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 500,
                                        color: 'text.secondary',
                                        mb: 2
                                    }}
                                >
                                    {pet.adoptionCenter?.centerName || "Adoption Center"}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 2 }}>
                                    {[
                                        { icon: <Pets />, value: pet.species },
                                        { icon: <Category />, value: pet.breed },
                                        { icon: pet.sex === 'Male' ? <Male /> : <Female />, value: pet.sex },
                                        { icon: <Cake />, value: `${pet.age} years` }
                                    ].map((item, index) => (
                                        <DetailItem key={index}>
                                            {item.icon}
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    fontWeight: 500,
                                                    color: 'text.primary'
                                                }}
                                            >
                                                {item.value}
                                            </Typography>
                                        </DetailItem>
                                    ))}
                                </Box>

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        mt: 3,
                                        mb: 1,
                                        color: 'text.primary'
                                    }}
                                >
                                    About {pet.petName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        lineHeight: 1.8,
                                        letterSpacing: 0.3,
                                        color: 'text.secondary',
                                    }}
                                >
                                    {pet.description}
                                </Typography>
                            </PetDetails>
                            <ActionSection>
                                {contactable && (
                                    <Box className="primary-actions">
                                        <Button
                                            onClick={handleContactCenter}
                                            variant="contained"
                                            size="large"
                                            startIcon={<MessageIcon />}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                borderRadius: '24px',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                            }}
                                        >
                                            Contact Center
                                        </Button>
                                    </Box>
                                )}
                                <Box className="secondary-actions">
                                    {saveable && (
                                        <Button
                                            onClick={handleSavePetToOwner}
                                            variant="outlined"
                                            size="large"
                                            startIcon={<BookmarkAdd />}
                                            sx={{
                                                borderRadius: '24px',
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                                '&:hover': {
                                                    borderColor: 'primary.dark',
                                                    bgcolor: 'primary.50',
                                                },
                                            }}
                                        >
                                            Save Pet
                                        </Button>
                                    )}
                                    {likeable && (
                                        <Button
                                            onClick={handleLikePet}
                                            variant="outlined"
                                            size="large"
                                            startIcon={<Favorite />}
                                            sx={{
                                                borderRadius: '24px',
                                                borderColor: 'secondary.main',
                                                color: 'secondary.main',
                                                '&:hover': {
                                                    borderColor: 'secondary.dark',
                                                    bgcolor: 'secondary.50',
                                                },
                                            }}
                                        >
                                            Like Pet
                                        </Button>
                                    )}
                                </Box>
                            </ActionSection>
                        </ContentSection>
                    </ContentWrapper>
                </ModalContainer>
            </Fade>
        </Modal>
    );
};

export default ExpandedPetCard;
