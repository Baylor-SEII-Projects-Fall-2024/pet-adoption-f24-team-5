import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    CircularProgress,
    Typography,
    Paper,
    Container,
    Divider
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import PetCard from '@/components/petCard/PetCard';
import { getAllPets } from '@/utils/pet/getAllPets';
import { getCenters } from '@/utils/user/center/getCenters';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const AvailablePets = () => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState([]);
    const [speciesFilter, setSpeciesFilter] = useState('');
    const [breedFilter, setBreedFilter] = useState('');
    const [colorFilter, setColorFilter] = useState('');
    const [sexFilter, setSexFilter] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [searchText, setSearchText] = useState('');
    const [distance, setDistance] = useState('');
    const [centerFilter, setCenterFilter] = useState('');
    const token = useSelector((state) => state.user.token);
    const userLocation = useSelector((state) => state.user.location);
    const [centers, setCenters] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle query parameter changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const centerId = params.get('centerId');

        if (centerId) {
            setCenterFilter(centerId.toString());
        } else {
            setCenterFilter('');
        }
    }, [location.search]);

    // Separate data fetching effect
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [petsResponse, centersResponse] = await Promise.all([
                    getAllPets(token),
                    getCenters(token)
                ]);
                setPets(petsResponse);
                setCenters(centersResponse);
                setLoading(false);
            } catch (error) {
                console.error(`Error getting data: ${error}`);
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const calculateDistance = (centerLocation) => {
        if (!userLocation || !centerLocation) return 0;

        const R = 6371; // Earth's radius in km
        const lat1 = userLocation.latitude * Math.PI / 180;
        const lat2 = centerLocation.latitude * Math.PI / 180;
        const dLat = (centerLocation.latitude - userLocation.latitude) * Math.PI / 180;
        const dLon = (centerLocation.longitude - userLocation.longitude) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const filteredPets = pets.filter(pet => {
        const searchTerms = searchText
            .toLowerCase()
            .split(',')
            .map(term => term.trim())
            .filter(term => term !== '');

        const matchesSearch = searchTerms.length === 0 || searchTerms.every(term =>
            pet.species.toLowerCase().includes(term) ||
            pet.breed.toLowerCase().includes(term) ||
            pet.color.toLowerCase().includes(term)
        );

        const matchesFilters =
            (speciesFilter ? pet.species.toLowerCase() === speciesFilter.toLowerCase() : true) &&
            (breedFilter ? pet.breed.toLowerCase() === breedFilter.toLowerCase() : true) &&
            (colorFilter ? pet.color.toLowerCase() === colorFilter.toLowerCase() : true) &&
            (sexFilter ? pet.sex.toLowerCase() === sexFilter.toLowerCase() : true) &&
            (ageFilter ? pet.age.toString() === ageFilter : true) &&
            (centerFilter ? pet.adoptionCenter.id.toString() === centerFilter.toString() : true);

        const center = centers.find(c => c.id === pet.adoptionCenter.id);
        const withinDistance = !distance || !userLocation || !center ||
            calculateDistance(center.location) <= parseInt(distance);

        return matchesSearch && matchesFilters && withinDistance;
    });

    const getUniqueValues = (key, filterBySpecies = false) => {
        if (filterBySpecies && speciesFilter) {
            return [...new Set(pets.filter(pet => pet.species.toLowerCase() === speciesFilter.toLowerCase()).map(pet => pet[key]))];
        }
        return [...new Set(pets.map(pet => pet[key]))];
    };

    const centerOptions = centers.map(center => ({
        id: center.id,
        name: center.centerName
    }));
    const speciesOptions = getUniqueValues('species');
    const breedOptions = getUniqueValues('breed', true);
    const colorOptions = getUniqueValues('color', true);
    const sexOptions = getUniqueValues('sex', true);
    const ageOptions = getUniqueValues('age', true);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                    Find Your Perfect Pet
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Search by species, breed, or color"
                            placeholder="Example: Golden Retriever, Black, Cat (separate terms with commas)"
                            variant="outlined"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            helperText="Separate multiple search terms with commas"
                        />
                    </Grid>

                    {/* Filters */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Species</InputLabel>
                            <Select
                                value={speciesFilter}
                                onChange={(e) => setSpeciesFilter(e.target.value)}
                            >
                                <MenuItem value="">All Species</MenuItem>
                                {speciesOptions.map((species) => (
                                    <MenuItem key={species} value={species}>{species}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Breed</InputLabel>
                            <Select
                                value={breedFilter}
                                onChange={(e) => setBreedFilter(e.target.value)}
                            >
                                <MenuItem value="">All Breeds</MenuItem>
                                {breedOptions.map((breed) => (
                                    <MenuItem key={breed} value={breed}>{breed}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Color</InputLabel>
                            <Select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                            >
                                <MenuItem value="">All Colors</MenuItem>
                                {colorOptions.map((color) => (
                                    <MenuItem key={color} value={color}>{color}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Sex</InputLabel>
                            <Select
                                value={sexFilter}
                                onChange={(e) => setSexFilter(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {sexOptions.map((sex) => (
                                    <MenuItem key={sex} value={sex}>{sex}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Age</InputLabel>
                            <Select
                                value={ageFilter}
                                onChange={(e) => setAgeFilter(e.target.value)}
                            >
                                <MenuItem value="">All Ages</MenuItem>
                                {ageOptions.map((age) => (
                                    <MenuItem key={age} value={age}>{age}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Adoption Center</InputLabel>
                            <Select
                                value={centerFilter}
                                onChange={(e) => setCenterFilter(e.target.value)}
                            >
                                <MenuItem value="">All Centers</MenuItem>
                                {centers.map((center) => (
                                    <MenuItem key={center.id} value={center.id}>
                                        {center.centerName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {userLocation && (
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Distance</InputLabel>
                                <Select
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                >
                                    <MenuItem value="">Any Distance</MenuItem>
                                    <MenuItem value="5">Within 5 km</MenuItem>
                                    <MenuItem value="10">Within 10 km</MenuItem>
                                    <MenuItem value="25">Within 25 km</MenuItem>
                                    <MenuItem value="50">Within 50 km</MenuItem>
                                    <MenuItem value="100">Within 100 km</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} />
                </Box>
            ) : (
                <>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                        {filteredPets.length} Pets Found
                    </Typography>
                    <Grid
                        container
                        spacing={3}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(4, 1fr)'
                            },
                            gap: 3
                        }}
                    >
                        {filteredPets.slice(0, 10).map((pet) => (
                            <Box key={pet.petName}>
                                <PetCard pet={pet} saveable={true} likeable={false} />
                            </Box>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default AvailablePets;
