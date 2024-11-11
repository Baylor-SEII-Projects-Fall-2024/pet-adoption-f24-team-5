import React, { useState } from 'react';
import { Box, Typography, Grid } from "@mui/material";
import PetCard from "@/components/PetCard";

const SavedPets = () => {
    const [savedPets, setSavedPets] = useState([]);

    const handleSavePet = (pet) => {
        setSavedPets((prevSavedPets) => [...prevSavedPets, pet]);
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Saved Pets
            </Typography>
            <Grid container spacing={3} justifyContent="center">
                {savedPets.length > 0 ? (
                    savedPets.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pet.petName}>
                            <PetCard pet={pet} onSave={handleSavePet} />
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
