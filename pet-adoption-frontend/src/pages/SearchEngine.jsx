import React, { useState } from 'react'
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
    const [showSavedPets, setShowSavedPets] = React.useState(false);
    const [savedPets, setSavedPets] = useState([]);
    const [email, setEmail] = useState(getSubjectFromToken(token));


    const handleSearch = async () => {
        setPets([]);

        const url = `${API_URL}/api/pets/search_engine`;

        try {
            const res = await axios.get(url, {
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

    const handleSaveChange = () => {
        setShowSavedPets(!showSavedPets);
        if (!showSavedPets){
            handleSearch();
        }
        else{
            fetchSavedPets();
        }
    }

    const fetchSavedPets = async () => {
        setSavedPets(pets);
        
        //setSavedPets([]);
        //Fetch info on saved pets here
        /*const url = `${API_URL}/api/pets/saved`;
        try {
            const res = await axios.get(url, {
                params: { email: email },
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setSavedPets(res.data);
        } catch (error) {
            console.error('Error fetching saved pets:', error);
        }*/
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
                {!showSavedPets && (
                    <Grid container spacing={2} sx={{ height: '100vh', width: '100vw', padding: 2 }}>

                    <Grid container spacing={2}>
                        {pets.length > 0 &&
                            pets.map((pet) => (
                                <Grid item xs={12} sm={6} md={4} key={pet.petName}>
                                    <PetCard pet={pet} />
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
                                Search
                            </Button>
                        </Grid>
                        <Grid container justifyContent="center" spacing={2}>
                        <Button
                                onClick={handleSaveChange}
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
                <Modal
                    open={showSavedPets}
                    onClose={handleSaveChange}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                <Box
                    sx={{
                        width: '80%',
                        maxHeight: '90vh',
                        backgroundColor: 'white',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Saved Pets
                    </Typography>
                    <Grid container spacing={2}>
                        {savedPets.length > 0 ? (
                            savedPets.map((pet) => (
                                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                    <PetCard pet={pet} />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Typography>No saved pets found</Typography>
                            </Grid>
                        )}
                    </Grid>
                    <Button
                        onClick={handleSaveChange}
                        variant="contained"
                        sx={{
                            mt: 3,
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
                </Modal>
            </Box>
        </>
    )
}

export default SearchEngine