import React, { useState } from 'react';
import { Modal, Typography, Button, Divider, Fade, Box, Tooltip, IconButton, Backdrop } from '@mui/material';
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
    Palette,
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
import { getUser } from '@/utils/user/getUser';
import { startConversation } from '@/utils/message/startConversation';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';


const ExpandedPetCard = ({ pet, onClose, saveable = true, likeable = true, contactable = true, onLike = null }) => {
    const token = useSelector((state) => state.user.token);
    const [imageZoom, setImageZoom] = React.useState(false);
    const navigate = useNavigate();

    if (!pet) return null;

    const handleSavePetToOwner = async () => {
        const email = getSubjectFromToken(token);
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
        const email = getSubjectFromToken(token);
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
                                cursor: 'pointer'
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
                                <Typography variant="h3" fontWeight={700}>
                                    {pet.petName}
                                </Typography>

                                <Typography
                                    variant="h6"
                                    color="text.secondary"
                                    sx={{ fontWeight: 500 }}
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
                                            <Typography variant="body1" fontWeight={500}>
                                                {item.value}
                                            </Typography>
                                        </DetailItem>
                                    ))}
                                </Box>

                                <Typography variant="h6" fontWeight={600} sx={{ mt: 3 }}>
                                    About {pet.petName}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.8,
                                        letterSpacing: 0.3,
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
                                                bgcolor: 'success.main',
                                                '&:hover': {
                                                    bgcolor: 'success.dark',
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
