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
    Divider,
    Pagination
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
    const [searchText, setSearchText] = useState('');
    const [centerFilter, setCenterFilter] = useState('');
    const [distance, setDistance] = useState('');
    const token = useSelector((state) => state.user.token);
    const userLocation = useSelector((state) => state.user.location);
    const [centers, setCenters] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

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
            pet.color.toLowerCase().includes(term) ||
            pet.sex.toLowerCase().includes(term) ||
            pet.age.toString().includes(term)
        );

        const matchesCenter = !centerFilter ||
            pet.adoptionCenter.id.toString() === centerFilter.toString();

        const center = centers.find(c => c.id === pet.adoptionCenter.id);
        const withinDistance = !distance || !userLocation || !center ||
            calculateDistance(center.location) <= parseInt(distance);

        return matchesSearch && matchesCenter && withinDistance;
    });

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: '92vh',
                py: 1,
                mb: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                maxWidth: '1800px'
            }}
        >
            <Paper
                elevation={1}
                sx={{
                    p: 1,
                    mb: 0.5,
                    borderRadius: '8px',
                    backgroundColor: 'background.paper',
                    flexShrink: 0
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            alignItems: 'center'
                        }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    whiteSpace: 'nowrap',
                                    fontSize: '1.1rem'
                                }}
                            >
                                Find Pets
                            </Typography>

                            <TextField
                                size="small"
                                placeholder="Search by species, breed, color, sex, or age (use commas to separate terms)"
                                variant="outlined"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: 'text.secondary',
                                                    whiteSpace: 'nowrap',
                                                    fontSize: '0.85rem'
                                                }}
                                            >
                                                {filteredPets.length} results
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                        '& input': {
                                            padding: '8px 0',
                                            fontSize: '0.95rem'
                                        }
                                    }
                                }}
                            />

                            <FormControl sx={{ width: 150 }}>
                                <Select
                                    value={centerFilter}
                                    onChange={(e) => setCenterFilter(e.target.value)}
                                    displayEmpty
                                    size="small"
                                    sx={{ height: '32px' }}
                                >
                                    <MenuItem value="">All Centers</MenuItem>
                                    {centers.map((center) => (
                                        <MenuItem key={center.id} value={center.id}>
                                            {center.centerName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {userLocation && (
                                <FormControl size="small" sx={{ width: 100 }}>
                                    <Select
                                        value={distance}
                                        onChange={(e) => setDistance(e.target.value)}
                                        displayEmpty
                                        sx={{ height: '32px' }}
                                    >
                                        <MenuItem value="">Distance</MenuItem>
                                        <MenuItem value="5">5 km</MenuItem>
                                        <MenuItem value="10">10 km</MenuItem>
                                        <MenuItem value="25">25 km</MenuItem>
                                        <MenuItem value="50">50 km</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Content Area */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0
            }}>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1
                    }}>
                        <CircularProgress size={40} />
                    </Box>
                ) : (
                    <>
                        {/* Scrollable Grid Container */}
                        <Box sx={{
                            flex: 1,
                            overflow: 'auto',
                            px: 1
                        }}>
                            <Grid
                                container
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'repeat(1, 1fr)',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)',
                                        lg: 'repeat(4, 1fr)'
                                    },
                                    gap: 1.5,
                                    mb: 1,
                                    gridAutoRows: 'min-content',
                                    maxHeight: 'calc(100vh - 200px)'
                                }}
                            >
                                {filteredPets
                                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                    .map((pet) => (
                                        <Box
                                            key={pet.petName}
                                            sx={{
                                                height: 'fit-content'
                                            }}
                                        >
                                            <PetCard
                                                pet={pet}
                                                saveable={true}
                                                likeable={false}
                                                expandable={true}
                                                contactable={true}
                                            />
                                        </Box>
                                    ))}
                            </Grid>
                        </Box>

                        {/* Pagination Footer */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            py: 1,
                            borderTop: 1,
                            borderColor: 'divider',
                            backgroundColor: 'background.paper',
                            flexShrink: 0,
                            mt: 'auto'
                        }}>
                            <Pagination
                                count={Math.ceil(filteredPets.length / itemsPerPage)}
                                page={page}
                                onChange={(e, value) => setPage(value)}
                                color="primary"
                                size="small"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default AvailablePets;
