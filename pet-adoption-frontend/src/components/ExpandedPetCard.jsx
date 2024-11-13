import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ImageComponent from './ImageComponent';
import { API_URL } from "@/constants";
import { getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector } from 'react-redux';
import axios from 'axios';


const ExpandedPetCard = ({ pet, onClose, saveable = true, likeable = true, onLike = null }) => {

    const token = useSelector((state) => state.user.token);

    const handleSavePetToOwner = () => {
        console.log("Saving pet to owner");
    };

    const handleLikePet = async () => {
        const url = `${API_URL}/api/recommendation-engine/update-preference`;
        const email = getSubjectFromToken(token);
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
        } catch (error) {
            console.error(error);
        }
        if (onLike) {
            onLike(pet);
        }
    };

    return (
        <Modal open={!!pet} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 4,
                    backgroundColor: 'white',
                    borderRadius: 2
                }}
            >
                <ImageComponent
                    imageName={pet.imageName}
                    width="100%"
                    maxWidth="200px"
                    height="auto"
                />
                <Typography variant="h4">{pet.petName}</Typography>
                <Typography variant="body1">Species: {pet.species}</Typography>
                <Typography variant="body1">Breed: {pet.breed}</Typography>
                <Typography variant="body1">Color: {pet.color}</Typography>
                <Typography variant="body1">Sex: {pet.sex}</Typography>
                <Typography variant="body1">Age: {pet.age}</Typography>
                <Typography variant="body1">Description: {pet.description}</Typography>
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
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default ExpandedPetCard;
