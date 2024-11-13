import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from "@mui/material";
import PetCard from "@/components/PetCard";
import { useSelector } from 'react-redux';
import axios from '../utils/axiosConfig';
import { API_URL } from "@/constants";
import { getSubjectFromToken } from '../utils/tokenUtils';

const SavedPets = () => {
    const [savedPets, setSavedPets] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));

    const getSavedPets = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/owner/get_saved_pets`, {
                params: { email: email },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setSavedPets(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeletePet = async (petToDelete) => {
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
            getSavedPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    useEffect(() => {
        getSavedPets();
    }, [token]);

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Saved Pets
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {savedPets.length > 0 ? (
                    savedPets.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pet.petName}>
                            <PetCard
                                pet={pet}
                                canDelete={true}
                                onDelete={handleDeletePet}
                            />
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" align="center">
                        No saved pets yet.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default SavedPets;
