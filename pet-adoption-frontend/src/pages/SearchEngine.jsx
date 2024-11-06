import React, {useState} from 'react'
import {Box, Grid, Card, CardContent, Typography, Button} from "@mui/material";
import TitleBar from "@/components/TitleBar";
import {API_URL} from "@/constants";
import {getSubjectFromToken} from "@/utils/tokenUtils";
import axios from "axios";
import {useSelector} from "react-redux";
import PetCard from "@/components/PetCard";

const SearchEngine = () => {
    const [pets, setPets] = useState([]);
    const token = useSelector((state) => state.user.token);


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

    return (
        <>
            <TitleBar/>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #edf2f7, #dce2e9)',
                }}
            >
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
                    </Grid>
                </Grid>
            </Box>
        </>


    )
}

export default SearchEngine
