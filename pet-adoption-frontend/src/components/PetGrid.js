import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Box, Typography } from '@mui/material';
import PetCard from './PetCard';
import TitleBar from "@/components/TitleBar";
import { API_URL } from "@/constants";
import axios from "axios";
import { useSelector } from 'react-redux'; // For accessing the token

const PetGrid = () => {
    const [pets, setPets] = useState([]); // State for storing pet data
    const [loading, setLoading] = useState(true); // State for loading
    const token = useSelector((state) => state.user.token); // Get the token from Redux

    // Fetch pets from API
    const getAllPets = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/pets`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            setPets(response.data); // Set the pets state
            setLoading(false); // Stop loading
        } catch (error) {
            console.error(`Error getting pets: ${error}`);
            setLoading(false);
        }
    };

    // Fetch pets on component mount
    useEffect(() => {
        getAllPets();
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
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            {/* Title bar */}
            <Box sx={{ height: '8vh', backgroundColor: 'primary.main' }}>
                <TitleBar />
            </Box>

            {/* Pet Grid */}
            <Box sx={{ flexGrow: 1, padding: 4 }}>
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ gap: '20px' }}
                >
                    {pets.map((pet) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pet.petName}>
                            <PetCard pet={pet} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default PetGrid;
