import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Container } from "@mui/material";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import PetCard from "@/components/petCard/PetCard";
import { generateNewOptions } from "@/utils/recommendationEngine/generateNewOptions";
import SavedPetsModal from "@/components/SavedPetsModal";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import HamburgerMenu from '@/components/HamburgerMenu';
import TuneIcon from '@mui/icons-material/Tune';

const FindAPetPage = () => {
    const [currentPets, setCurrentPets] = useState([]);
    const [preloadedPets, setPreloadedPets] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const userType = getAuthorityFromToken(token);
    const [loading, setLoading] = useState(true);
    const [savedPetsModalOpen, setSavedPetsModalOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    useEffect(() => {
        const initialLoad = async () => {
            try {
                // Load current set
                const initialPets = await generateNewOptions(token);
                setCurrentPets(initialPets);

                // Immediately preload next set
                const nextPets = await generateNewOptions(token);
                setPreloadedPets(nextPets);

                setLoading(false);
            } catch (error) {
                console.error('Error loading initial pets:', error);
                setLoading(false);
            }
        };

        initialLoad();
    }, [token]);

    const handleSearch = async () => {
        // Use preloaded pets if available
        if (preloadedPets.length > 0) {
            // Immediately show preloaded pets without loading state
            setCurrentPets(preloadedPets);

            // Start preloading the next set in the background
            try {
                const nextPets = await generateNewOptions(token);
                setPreloadedPets(nextPets);
            } catch (error) {
                console.error('Error preloading next set:', error);
            }
        } else {
            // Only show loading state if we need to fetch new pets
            setLoading(true);
            try {
                const newPets = await generateNewOptions(token);
                setCurrentPets(newPets);

                // Preload next set
                const nextPets = await generateNewOptions(token);
                setPreloadedPets(nextPets);
            } catch (error) {
                console.error('Error loading pets:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleLikePet = async (pet) => {
        // Show some visual feedback
        // Then load next set of pets
        handleSearch();
    };

    const handleOpenMenu = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchorEl(null);
    };

    const handleSelectSpecies = async (species) => {
        setLoading(true);
        try {
            // You'll need to modify generateNewOptions to accept species parameter
            const newPets = await generateNewOptions(token, species.toLowerCase());
            setCurrentPets(newPets);

            // Preload next set
            const nextPets = await generateNewOptions(token, species.toLowerCase());
            setPreloadedPets(nextPets);
        } catch (error) {
            console.error('Error loading pets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPreferences = async () => {
        setLoading(true);
        try {
            // You'll need to implement this endpoint
            await fetch('/api/users/reset-preferences', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Load new pets with reset preferences
            const newPets = await generateNewOptions(token);
            setCurrentPets(newPets);

            // Preload next set
            const nextPets = await generateNewOptions(token);
            setPreloadedPets(nextPets);
        } catch (error) {
            console.error('Error resetting preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: '92vh',
                py: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                maxWidth: '1800px'
            }}
        >
            {/* Header */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Find Your Match
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Like pets to improve your recommendations
                </Typography>
            </Box>

            {/* Content Area */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                minHeight: 0,
                justifyContent: 'center'
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
                        {/* Pet Grid - Single Row of Three */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            px: 1,
                            mb: 2
                        }}>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        sm: 'repeat(2, 1fr)',
                                        md: 'repeat(3, 1fr)', // Always show 3 columns on medium and up
                                    },
                                    gap: 3,
                                    maxWidth: '1400px', // Increased to accommodate 3 cards
                                    width: '100%'
                                }}
                            >
                                {currentPets.slice(0, 3).map((pet) => ( // Show 3 pets
                                    <Box
                                        key={pet.id}
                                        sx={{ height: 'fit-content' }}
                                    >
                                        <PetCard
                                            pet={pet}
                                            saveable={true}
                                            likeable={true}
                                            expandable={true}
                                            contactable={true}
                                            onLike={handleLikePet}
                                            size="large"
                                        />
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Action Buttons */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: '16px',
                                bgcolor: 'background.paper',
                                boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                                mt: 'auto',
                                mb: 2,
                                position: 'relative',
                                zIndex: 1,
                                overflow: 'hidden'
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2,
                                    py: 1.5,
                                    maxWidth: '1400px',
                                    margin: '0 auto',
                                    width: '100%',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    onClick={handleSearch}
                                    startIcon={<CloseIcon />}
                                    sx={{
                                        minWidth: 150,
                                        height: 40,
                                        borderColor: 'error.main',
                                        color: 'error.main',
                                        '&:hover': {
                                            borderColor: 'error.dark',
                                            bgcolor: 'error.50'
                                        }
                                    }}
                                >
                                    Skip These
                                </Button>

                                <Button
                                    variant="contained"
                                    size="medium"
                                    onClick={() => setSavedPetsModalOpen(true)}
                                    sx={{
                                        minWidth: 150,
                                        height: 40,
                                        bgcolor: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.dark'
                                        }
                                    }}
                                >
                                    View Saved
                                </Button>

                                <Button
                                    variant="contained"
                                    size="medium"
                                    onClick={handleOpenMenu}
                                    startIcon={<TuneIcon />}
                                    sx={{
                                        minWidth: 150,
                                        height: 40,
                                        bgcolor: 'secondary.main',
                                        '&:hover': {
                                            bgcolor: 'secondary.dark'
                                        }
                                    }}
                                >
                                    Change Preferences
                                </Button>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>

            {/* Modals */}
            <SavedPetsModal
                open={savedPetsModalOpen}
                onClose={() => setSavedPetsModalOpen(false)}
            />

            <HamburgerMenu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleCloseMenu}
                onSelectSpecies={handleSelectSpecies}
                onResetPreferences={handleResetPreferences}
            />
        </Container>
    );
};

export default FindAPetPage;