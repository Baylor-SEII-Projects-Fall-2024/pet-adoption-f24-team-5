import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Box, Button, Card, CardContent, Stack, Toolbar, Typography, Grid, CardMedia } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import axios from '../utils/axiosConfig';
import EventCard from '@/components/EventCard';
import PetCard from '@/components/PetCard';
import { API_URL } from "@/constants";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/tokenUtils";


const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [pets, setPets] = useState([]);
    const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchEmailAddress = async () => {
            try {
                setEmailAddress(getSubjectFromToken(token));
                setAuthority(getAuthorityFromToken(token));
            } catch (error) {
                console.error('Error fetching email address:', error);
            }
        };

        fetchEmailAddress();
    }, [token]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        const fetchPets = async () => {
            const url = `${API_URL}/api/pets`;
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    setPets(res.data);
                })
                .catch(error => console.error(`Error getting pets: ${error}`));
        };

        fetchEvents();
        fetchPets();
    }, [token]);

    const handleCollapseToggle = () => {
        setIsEventsCollapsed(!isEventsCollapsed);
    };

    return (
        <Box sx={{ height: '92vh', display: 'flex', flexDirection: 'row' }}>
            {!isEventsCollapsed && (
                <Box sx={{ width: '25vw', display: 'flex', flexDirection: 'column', borderRight: '1px solid black', overflowY: 'auto', height: '100%' }}>
                    <Button onClick={handleCollapseToggle} sx={{ position: 'absolute', left: '23vw' }}>
                        {'<'}
                    </Button>
                    <Grid container spacing={2} padding={2}>
                        {events.map((event) => (
                            <Grid item xs={12} key={event.name}>
                                <EventCard event={event} key={event.name} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            {isEventsCollapsed && (
                <Button onClick={handleCollapseToggle} sx={{ position: 'absolute', left: '0' }}>
                    {'>'}
                </Button>
            )}
            <Box sx={{
                width: isEventsCollapsed ? '100vw' : '75vw',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 4,
                padding: 4
            }}>
                {pets.slice(0, 10).map((pet) => (
                    <PetCard pet={pet} key={pet.name} />
                ))}
            </Box>
        </Box>
    );
};

export default HomePage;
