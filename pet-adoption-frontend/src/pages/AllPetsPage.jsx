import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Select, FormControl, InputLabel, Grid, CircularProgress, Typography } from "@mui/material";
import PetCard from '@/components/petCard/PetCard';
import { getAllPets } from '@/utils/pet/getAllPets';
import { useSelector } from 'react-redux';

const AvailablePets = () => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [speciesFilter, setSpeciesFilter] = useState('');
    const [breedFilter, setBreedFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [sexFilter, setSexFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await getAllPets(token);
                setPets(response);
                setLoading(false);
            } catch (error) {
                console.error(`Error getting pets: ${error}`);
                setLoading(false);
            }
        };
        fetchPets();
    }, [token]);

    const filteredPets = pets.filter(pet =>
        (speciesFilter ? pet.species.toLowerCase() === speciesFilter.toLowerCase() : true) &&
        (breedFilter ? pet.breed.toLowerCase() === breedFilter.toLowerCase() : true) &&
        (colorFilter ? pet.color.toLowerCase() === colorFilter.toLowerCase() : true) &&
        (sexFilter ? pet.sex.toLowerCase() === sexFilter.toLowerCase() : true) &&
        (ageFilter ? pet.age.toString() === ageFilter : true)
    );

    if (loading) {
        return <CircularProgress style={{ margin: 'auto', display: 'block' }} />;
    }

    return (
        <Box sx={{ height: '92vh', display: 'flex', flexDirection: 'column' }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Species</InputLabel>
                <Select
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Cat">Cat</MenuItem>
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
                </Select>
            </FormControl>

            <Box sx={{ flexGrow: 1, padding: 4 }}>
                <Grid
                    container
                    spacing={3}
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{ gap: '20px' }}
                >
                    {filteredPets.slice(0, 10).map((pet) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={pet.petName}>
                            <PetCard pet={pet} saveable={false} likeable={false} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default AvailablePets;
