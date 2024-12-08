import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Button,
    Stack,
    CircularProgress,
    Container,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    Pagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import PetCard from "@/components/petCard/PetCard";
import PetFormComponent from "@/components/petForm/PetFormComponent";
import { getAllPets } from "@/utils/user/center/getAllPets";
import { useSelector } from 'react-redux';

const PetManager = () => {
    const [formType, setFormType] = useState('');
    const [pets, setPets] = useState([]);
    const [postNewPet, setPostNewPet] = useState(false);
    const token = useSelector((state) => state.user.token);
    const [formPet, setFormPet] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const handleCardClick = (pet) => {
        setFormPet(pet);
        setFormType("update");
        setPostNewPet(true);
    }

    const handlePostNewPet = () => {
        setPostNewPet(!postNewPet);
        setFormType("save")
        setFormPet({})
    }

    const getPets = async () => {
        setLoading(true);
        try {
            const petsData = await getAllPets(token);
            setPets(petsData);
        } catch (error) {
            console.error('Error fetching pets:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postNewPet === false) {
            getPets();
            setFormType('');
        }
    }, [postNewPet]);

    const filteredPets = pets.filter(pet => {
        const searchTerms = searchText
            .toLowerCase()
            .split(',')
            .map(term => term.trim())
            .filter(term => term !== '');

        return searchTerms.length === 0 || searchTerms.every(term =>
            pet.species.toLowerCase().includes(term) ||
            pet.breed.toLowerCase().includes(term) ||
            pet.color.toLowerCase().includes(term) ||
            pet.sex.toLowerCase().includes(term) ||
            pet.age.toString().includes(term)
        );
    });

    return (
        <Container maxWidth="xl" sx={{ height: '92vh', py: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {postNewPet ? (
                <PetFormComponent type={formType} handlePostNewPet={handlePostNewPet} pet={formPet} />
            ) : (
                <>
                    <Paper elevation={1} sx={{ p: 1, mb: 0.5, borderRadius: '8px', backgroundColor: 'background.paper' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Button
                                        onClick={handlePostNewPet}
                                        color='primary'
                                        variant='contained'
                                        sx={{ height: '40px' }}
                                    >
                                        Post New Pet
                                    </Button>

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
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {filteredPets.length} pets
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
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
                                            mb: 1
                                        }}
                                    >
                                        {filteredPets
                                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                            .map((pet) => (
                                                <Box key={pet.petName} sx={{ height: 'fit-content' }}>
                                                    <PetCard
                                                        pet={pet}
                                                        expandable={false}
                                                        saveable={false}
                                                        likeable={false}
                                                        onClick={() => handleCardClick(pet)}
                                                        isManagerView={true}
                                                    />
                                                </Box>
                                            ))}
                                    </Grid>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 1,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                    backgroundColor: 'background.paper'
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
                </>
            )}
        </Container>
    );
};

export default PetManager;