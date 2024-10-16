import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppBar, Box, Button, Card, CardContent, Stack, Toolbar, Typography, Grid, CardMedia } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import axios from 'axios';

function getSubjectFromToken(token) {
    try {
        const base64Url = token.split('.')[1]; // Get the payload part of the token
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Handle URL-safe base64
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const payload = JSON.parse(jsonPayload);
        return payload.sub; // Return the subject
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
}

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [pets, setPets] = useState([]);
    const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchEmailAddress = async () => {
            try {
                setEmailAddress(getSubjectFromToken(token));
            } catch (error) {
                console.error('Error fetching email address:', error);
            }
        };

        fetchEmailAddress();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events', {
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
            const url = "http://localhost:8080/api/pets";
            axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    setPets(res.data);
                    console.log(res.data);
                })
                .catch(error => console.error(`Error getting pets: ${error}`));
        };

        fetchEvents();
        fetchPets();
    }, [token]);

    const handleCollapseToggle = () => {
        setIsEventsCollapsed(!isEventsCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/Login'); // Redirect to login page
    };

    const EventCard = ({ event }) => (
        <Card sx={{ width: '100%', height: '20vh' }} elevation={4} key={event.name}>
            <CardContent>
                <Typography variant='h5' align='center'>{event.event_name}</Typography>
                <Typography variant='body2' align='center'>{event.description}</Typography>
            </CardContent>
        </Card>
    );

    const PetCard = ({ pet }) => (
        <Card sx={{ width: '48%' }} elevation={4} key={pet.name}>
            <CardContent>
                <Typography variant='h5' align='center'>{pet.petName}</Typography>
                <Typography variant='body2' align='center'>{pet.description}</Typography>
                <CardMedia
                    component="img"
                    image={pet.imageName}
                    alt="Pet"
                    sx={{
                        float: 'left',
                        margin: '0 15px 15px 0',
                        maxWidth: '200px',
                        height: 'auto'
                    }}
                />
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '8vh', width: '100vw', backgroundColor: 'primary.main' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Pet Adoption
                    </Typography>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                        {emailAddress}
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/CreateEvent">Create Event</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" onClick={handleLogout}>Log Out</Button>
                </Toolbar>
            </Box>
            <Box sx={{ height: '92vh', display: 'flex', flexDirection: 'row' }}>
                {!isEventsCollapsed && (
                    <Box sx={{ width: '25vw', display: 'flex', flexDirection: 'column', borderRight: '1px solid black', overflowY: 'auto', height: '100%' }}>
                        <Button onClick={handleCollapseToggle} sx={{ position: 'absolute', left: '23vw' }}>
                            {'<'}
                        </Button>
                        <Grid container spacing={2} padding={2}>
                            {events.map((event) => (
                                <Grid item xs={12} key={event.name}>
                                    <EventCard event={event} />
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
                <Box sx={{ width: isEventsCollapsed ? '100vw' : '75vw', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 4, padding: 4 }}>
                    {pets.map((pet) => (
                        <PetCard pet={pet} key={pet.name} />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;
