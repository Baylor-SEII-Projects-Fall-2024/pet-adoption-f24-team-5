import { Card, CardContent, Typography, CircularProgress, Box, Button } from "@mui/material";
import ImageComponent from "@/components/ImageComponent";
import { useState } from "react";
import { getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector } from "react-redux";
import axios from "@/utils/axiosConfig";
import { API_URL } from "@/constants";
import ExpandedPetCard from "@/components/ExpandedPetCard";

const PetCard = ({ pet, onClick }) => {
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useSelector((state) => state.user.token);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleSavePetToOwner = async () => {
        const email = getSubjectFromToken(token);
        const updatedPet = {
            email: email,
            petId: pet.petId,
        };
        try {
            await axios.put(`${API_URL}/api/update/Owner/addSavedPet`, updatedPet,
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleExpandClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Card
                onClick={onClick}
                sx={{
                    width: "48%",
                    "&:hover": {
                        border: "2px solid blue",
                    },
                }}
                elevation={2}
                key={pet.petName}
            >
                <CardContent>
                    <Box
                        position="relative"
                        width="100%"
                        maxWidth="200px"
                        height="auto"
                        margin="0 15px 15px 0"
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

                    <Typography variant="h4" align="left">
                        {pet.petName}
                    </Typography>
                    <Typography variant="body2" align="left">
                        Species: {pet.species}
                    </Typography>
                    <Typography variant="body2" align="left">
                        Breed: {pet.breed}
                    </Typography>
                    <Typography variant="body2" align="left">
                        Color: {pet.color}
                    </Typography>
                    <Typography variant="body2" align="left">
                        Age: {pet.age}
                    </Typography>
                    <Typography variant="body2" align="left">
                        Description: {pet.description}
                    </Typography>
                    <Button onClick={handleSavePetToOwner} variant="contained" color="primary">
                        Save Pet
                    </Button>
                    <Button onClick={handleExpandClick} variant="outlined" color="secondary">
                        Expand
                    </Button>
                </CardContent>
            </Card>

            {isModalOpen && (
                <ExpandedPetCard pet={pet} onClose={handleCloseModal} />
            )}
        </>
    );
};

export default PetCard;
