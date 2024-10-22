import React, { useState, useEffect } from 'react';
import PetGrid from '@/components/PetGrid';
import {Box} from "@mui/material";
import TitleBar from "@/components/TitleBar";

const petsData = [
    {
        petName: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        color: 'Golden',
        age: '3 years',
        description: 'Friendly and playful.',
        imageName: 'buddy.jpg',
    },
    {
        petName: 'Whiskers',
        species: 'Cat',
        breed: 'Siberian',
        color: 'Gray',
        age: '2 years',
        description: 'Loves cuddles.',
        imageName: 'whiskers.jpg',
    },
    // Add more pets here...
];

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
