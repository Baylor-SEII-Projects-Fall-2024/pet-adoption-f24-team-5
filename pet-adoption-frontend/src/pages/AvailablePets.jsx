import React, { useState, useEffect } from 'react';
import PetGrid from '@/components/PetGrid';
import {Box} from "@mui/material";
import TitleBar from "@/components/TitleBar";

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
            <TitleBar/>
            <PetGrid pets={pets} loading={loading} />
        </Box>
    )
};

export default AvailablePets;
