import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import PetCard from './PetCard';
import { useSelector } from 'react-redux'; // For accessing the token
import { getAllPets } from '@/utils/pet/getAllPets';

const PetGrid = () => {
    const [pets, setPets] = useState([]); // State for storing pet data
    const [loading, setLoading] = useState(true); // State for loading
    const token = useSelector((state) => state.user.token); // Get the token from Redux



    // Fetch pets on component mount
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await getAllPets(token);
                setPets(response); // Set the pets state
                setLoading(false); // Stop loading
            } catch (error) {
                console.error(`Error getting pets: ${error}`);
                setLoading(false);
            }
        };
        fetchPets();
    }, []);

    if (loading) {
        return <CircularProgress style={{ margin: 'auto', display: 'block' }} />;
    }

    if (pets.length === 0) {
        return (
            <Typography variant="h5" align="center" sx={{ marginTop: 5 }}>
                No pets available for adoption at the moment.
            </Typography>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 4 }}>
            <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
                sx={{ gap: '20px' }}
            >
                {pets.slice(0, 10).map((pet) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pet.petName}>
                        <PetCard pet={pet} saveable={false} likeable={false} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PetGrid;
