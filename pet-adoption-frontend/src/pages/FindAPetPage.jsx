import React, { useState, useCallback, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import PetCard from "@/components/petCard/PetCard";
import { generateNewOptions } from "@/utils/recommendationEngine/generateNewOptions";
import { getSavedPets } from "@/utils/user/owner/GetSavedPets";

const FindAPetPage = () => {
    const [pets, setPets] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const [showSavedPets, setShowSavedPets] = React.useState(false);
    const [savedPets, setSavedPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const handleSearch = async () => {
        const response = await generateNewOptions(token);
        setPets(response);
    }

    useEffect(() => {
        handleSearch();
        setShowWelcomeModal(true);
    }, []);

    const handleOpenSavedPets = async () => {
        setShowSavedPets(true);
        const response = await getSavedPets(token, email);
        setSavedPets(response);
    }

    const handleCloseSavedPets = () => {
        setShowSavedPets(false);
    }

    const handleCloseWelcomeModal = () => {
        setShowWelcomeModal(false);
    }

    return (
        <>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #edf2f7, #dce2e9)',
                }}
            >
                <Modal
                    open={showWelcomeModal}
                    onClose={handleCloseWelcomeModal}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box
                        sx={{
                            width: '400px',
                            backgroundColor: 'white',
                            borderRadius: 4,
                            boxShadow: 24,
                            p: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h4" sx={{ mb: 2 }}>
                            Welcome to the Pet Search Engine!
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 4 }}>
                            Find your perfect pet match by exploring the recommendations below, here is how it works:
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4 }}>
                            1. If this is your first time the first three rounds will pe preliminary meaning it is gauging your initial preferences by showing random pets
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4 }}>
                            2. If you like a pet it will take you preferences into account, and suggest more pets similar to that one
                        </Typography>

                        <Button
                            onClick={handleCloseWelcomeModal}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(90deg, #43cea2, #246e56)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #246e56, #43cea2)',
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Modal>
                {!showSavedPets && (
                    <Grid container spacing={2} sx={{ height: '100vh', width: '100vw', padding: 2 }}>

                        <Grid container spacing={2}>
                            {pets.length > 0 &&
                                pets.map((pet) => (
                                    <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                        <PetCard pet={pet} onLike={handleSearch} />
                                    </Grid>
                                ))}
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container justifyContent="center" spacing={2}>
                                <Button
                                    onClick={handleSearch}
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(90deg, #43cea2, #246e56)',
                                        color: 'white',
                                        width: '450px',
                                        padding: '10px 0',
                                        borderRadius: '50px',
                                        marginTop: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #246e56, #43cea2)',
                                        },
                                    }}
                                >
                                    Refresh Pets
                                </Button>
                            </Grid>
                            <Grid container justifyContent="center" spacing={2}>
                                <Button
                                    onClick={handleOpenSavedPets}
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(90deg, #43cea2, #246e56)',
                                        color: 'white',
                                        width: '450px',
                                        padding: '10px 0',
                                        borderRadius: '50px',
                                        marginTop: 2,
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #246e56, #43cea2)',
                                        },
                                    }}
                                >
                                    View Saved Pets
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
                {showSavedPets && (
                    <Modal
                        open={showSavedPets}
                        onClose={handleCloseSavedPets}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                width: '80%',
                                height: '550px',
                                backgroundColor: 'white',
                                borderRadius: 4,
                                boxShadow: 24,
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box
                                sx={{
                                    flex: 1,
                                    overflowY: 'auto',
                                    mb: 2,
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
                                    Saved Pets
                                </Typography>
                                {loading ? (
                                    <Typography>Loading saved pets...</Typography>
                                ) : savedPets.length > 0 ? (
                                    <Grid container spacing={2}>
                                        {savedPets.map((pet) => (
                                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                                <PetCard pet={pet} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Typography>No saved pets found</Typography>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 2,
                                }}
                            >
                                <Button
                                    onClick={handleCloseSavedPets}
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(90deg, #43cea2, #246e56)',
                                        color: 'white',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #246e56, #43cea2)',
                                        },
                                    }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                )}
            </Box>
        </>
    )
}

export default FindAPetPage;