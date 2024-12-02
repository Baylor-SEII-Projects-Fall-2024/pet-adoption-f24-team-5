import React, { useState, useEffect } from 'react';
import PetGrid from '@/components/petCard/PetGrid';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";


const petsData = [];

const AvailablePets = () => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [speciesFilter, setSpeciesFilter] = useState('');
    const [breedFilter, setBreedFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [sexFilter, setSexFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');

    useEffect(() => {
        // Simulating API fetch
        setTimeout(() => {
            setPets(petsData);
            setLoading(false);
        }, 2000); // Delay for effect
    }, []);

    const filteredPets = pets.filter(pet =>
        (speciesFilter ? pet.species.toLowerCase() === speciesFilter.toLowerCase() : true) &&
        (breedFilter ? pet.breed.toLowerCase() === breedFilter.toLowerCase() : true) &&
        (colorFilter ? pet.color.toLowerCase() === colorFilter.toLowerCase() : true) &&
        (sexFilter ? pet.sex.toLowerCase() === sexFilter.toLowerCase() : true) &&
        (ageFilter ? pet.age.toString() === ageFilter : true)
    );

    return (
        <Box sx={{ height: '92vh', display: 'flex' }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Species</InputLabel>
                <Select
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Cat">Cat</MenuItem>
                    {/* Add more species as needed */}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Breed</InputLabel>
                <Select
                    value={breedFilter}
                    onChange={(e) => setBreedFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Labrador">Labrador</MenuItem>
                    {/* Add more breeds as needed */}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Color</InputLabel>
                <Select
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Brown">Brown</MenuItem>
                    {/* Add more colors as needed */}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sex</InputLabel>
                <Select
                    value={sexFilter}
                    onChange={(e) => setSexFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    {/* Add more sexes as needed */}
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Age</InputLabel>
                <Select
                    value={ageFilter}
                    onChange={(e) => setAgeFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="1">1</MenuItem>
                    <MenuItem value="2">2</MenuItem>
                    {/* Add more ages as needed */}
                </Select>
            </FormControl>

            <PetGrid pets={filteredPets} loading={loading} />
        </Box>
    )
};

export default AvailablePets;
