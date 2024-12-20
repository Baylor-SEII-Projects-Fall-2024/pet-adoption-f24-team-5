import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button } from "@mui/material";
import PetCard from "@/components/petCard/PetCard";
import { useSelector } from 'react-redux';
import axios from '../utils/redux/axiosConfig';
import { API_URL } from "@/constants";
import { getSubjectFromToken } from '../utils/redux/tokenUtils';
import { getSavedPets } from '../utils/user/owner/GetSavedPets';
import { removeSavedPet } from '../utils/user/owner/RemoveSavedPets';

const SavedPets = () => {
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const [savedPets, setSavedPets] = useState([]);

    const handleDeletePet = async (petToDelete) => {
        try {
            await removeSavedPet(petToDelete, token, email);
            const savedPets = await getSavedPets(token, email);
            setSavedPets(savedPets);
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    useEffect(() => {
        const fetchSavedPets = async () => {
            try {
                const pets = await getSavedPets(token, email);
                setSavedPets(pets);
            } catch (error) {
                console.error('Error fetching saved pets:', error);
            }
        };

        fetchSavedPets();
    }, [token, email]);

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
                                onDelete={() => handleDeletePet(pet)}
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
