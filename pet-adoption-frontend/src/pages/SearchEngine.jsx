import React, { useState, useCallback, useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Modal } from "@mui/material";
import TitleBar from "@/components/TitleBar";
import { API_URL } from "@/constants";
import { getSubjectFromToken } from "@/utils/tokenUtils";
import axios from "axios";
import { useSelector } from "react-redux";
import PetCard from "@/components/PetCard";

const SearchEngine = () => {
    const [pets, setPets] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const [showSavedPets, setShowSavedPets] = React.useState(false);
    const [savedPets, setSavedPets] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setPets([]);
        const email = getSubjectFromToken(token);

        const url = `${API_URL}/api/recommendation-engine/generate-new-options`;
        try {
            const res = await axios.get(url, {
                params: { email: email },
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                },
            });
            setPets(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleResetPreferences = async () => {
        const url = `${API_URL}/api/recommendation-engine/reset-preferences`;
        await axios.post(url, { email }, { headers: { Authorization: `Bearer ${token}` } });
        handleSearch();
    }

    useEffect(() => {
        handleSearch();
    }, []);

    const handleOpenSavedPets = () => {
        setShowSavedPets(true);
        fetchSavedPets();
    }

    const handleCloseSavedPets = () => {
        setShowSavedPets(false);
    }

    const fetchSavedPets = useCallback(async () => {
        setLoading(true);
        setSavedPets([]);
        const url = `${API_URL}/api/owner/get_saved_pets`;

        try {
            const res = await axios.get(url, {
                params: { email },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setSavedPets(res.data);
        } catch (error) {
            console.error('Error fetching saved pets:', error);
        }
        finally {
            setLoading(false);
        }
    }, [token, email]);

    // useEffect(() => {
    //     fetchSavedPets();
    // }, [fetchSavedPets]);

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
                {!showSavedPets && (
                    <Grid container spacing={2} sx={{ height: '100vh', width: '100vw', padding: 2 }}>

                        <Grid container spacing={2}>
                            {pets.length > 0 &&
                                pets.map((pet) => (
                                    <Grid item xs={12} sm={6} md={4} key={pet.petName}>
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
                            <Grid container justifyContent="center" spacing={2}>
                                <Button
                                    onClick={handleResetPreferences}
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
                                    Reset Preferences
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

export default SearchEngine