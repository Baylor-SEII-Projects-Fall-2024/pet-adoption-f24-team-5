import React, { useState, useEffect } from 'react';
import PetGrid from '@/components/petCard/PetGrid';
import { Box } from "@mui/material";

const petsData = [];

const AvailablePets = () => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);

    useEffect(() => {
        // Simulating API fetch
        setTimeout(() => {
            setPets(petsData);
            setLoading(false);
        }, 2000); // Delay for effect
    }, []);

    return (
        <Box>
            <PetGrid pets={pets} loading={loading} />
        </Box>
    )
};

export default AvailablePets;
