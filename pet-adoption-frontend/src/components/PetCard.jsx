import { Card, CardContent, Typography, CircularProgress, Box, Button, styled } from "@mui/material";
import ImageComponent from "@/components/ImageComponent";
import { useState } from "react";
import { getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector } from "react-redux";
import axios from "@/utils/axiosConfig";
import { API_URL } from "@/constants";
import ExpandedPetCard from "@/components/ExpandedPetCard";

const StyledCard = styled(Card)(({ theme, isHovered }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: '0.3s',
}));

const BlurredContent = styled(Box)(({ isHovered }) => ({
    transition: 'filter 0.3s',
    ...(isHovered && {
        filter: 'blur(2px)',
    }),
}));

const HoverOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&.hovered': {
        opacity: 1,
    },
}));

const PetCard = ({ pet, onClick, expandable = true, saveable = true, likeable = true, onLike = null, onDelete = null }) => {
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);

    const handleImageLoad = () => {
        setLoading(false);
    };

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
            await axios.post(`${API_URL}/api/owner/save_pet_user`, formattedPet, {
                params: { email: email },
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleExpandClick = () => {
        if (expandable) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLikePet = async () => {
        const url = `${API_URL}/api/recommendation-engine/update-preference`;
        const preference = {
            preferredSpecies: pet.species,
            preferredBreed: pet.breed,
            preferredColor: pet.color,
            preferredAge: pet.age,
        };
        try {
            await axios.post(url, preference, {
                params: { email: email },
                headers: { Authorization: `Bearer ${token}` },
            });
            if (onLike) {
                onLike(pet);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                width: '330px',
                height: '600px',
            }}
        >
            <StyledCard
                onClick={onClick}
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    "&:hover": {
                        border: "2px solid blue",
                    },
                }}
                elevation={2}
                key={pet.petName}
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <BlurredContent isHovered={isHovered}>
                    <CardContent>
                        <Typography variant="h4" align="left">
                            {pet.petName}
                        </Typography>

                        <Box
                            position="relative"
                            width="100%"
                            height="auto"
                            margin="0 15px 15px 0"
                            justifyContent="left"
                            alignItems="center"
                        >
                            {loading && (
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    width="100%"
                                    height="100%"
                                    bgcolor="rgba(255, 255, 255, 0.6)"
                                    zIndex={1}
                                >
                                    <CircularProgress />
                                </Box>
                            )}

                            <ImageComponent
                                imageName={pet.imageName}
                                width="100%"
                                maxWidth="200px"
                                height="auto"
                                onLoad={handleImageLoad}
                            />
                        </Box>

                    </CardContent>
                </BlurredContent>
                <HoverOverlay className={isHovered ? 'hovered' : ''}>
                    <Box onClick={handleExpandClick}>
                        <Typography variant="h6" align="left">
                            Species: {pet.species}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Breed: {pet.breed}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Color: {pet.color}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Sex: {pet.sex}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Age: {pet.age}
                        </Typography>
                        <Typography variant="body1" align="left">
                            Description: {pet.description}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={2}
                    >
                        {saveable && (
                            <Button onClick={handleSavePetToOwner} variant="contained" color="primary">
                                Save Pet
                            </Button>
                        )}
                        {likeable && (
                            <Button onClick={handleLikePet} variant="contained" color="primary">
                                Like Pet
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                onClick={() => onDelete(pet)} // This calls the parent function to delete the pet
                                variant="contained"
                                color="secondary"
                            >
                                Delete Pet
                            </Button>
                        )}
                    </Box>
                </HoverOverlay>
            </StyledCard>

            {isModalOpen && (
                <ExpandedPetCard pet={pet} saveable={saveable} likeable={likeable} onClose={handleCloseModal} onLike={onLike} />
            )}
        </Box>
    );
};

export default PetCard;
