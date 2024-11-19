import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for redirection
import axios from '../utils/redux/axiosConfig';
import EventCard from '../components/eventCard/EventCard';
import PetCard from '../components/petCard/PetCard';
import { API_URL } from "@/constants";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { getCenterEvents } from "@/utils/user/center/getCenterEvents";
import { getEvents } from "@/utils/event/getEvents";
import { getAllPets } from "@/utils/pet/getAllPets";
import { getCenterName } from "@/utils/user/center/getCenterName";

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [pets, setPets] = useState([]);
    const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate(); // Hook for navigation
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                let eventsResponse;  // Declare the variable

                if (getAuthorityFromToken(token) === "Owner") {
                    eventsResponse = await getEvents(token) || [];
                } else {
                    eventsResponse = await getCenterEvents(token, getSubjectFromToken(token)) || [];
                }

                const eventsWithCenterNames = await Promise.all(
                    eventsResponse.map(async (event) => {
                        const centerName = await getCenterName(token, event.center_id);
                        return { ...event, center_name: centerName };
                    })
                );

                setEvents(eventsWithCenterNames);
            } catch (error) {
                console.error("Error fetching events:", error);
                setEvents([]); // Set empty array on error
            }
        };

        const fetchPets = async () => {
            try {
                setLoading(true);
                const petsData = await getAllPets(token);
                setPets(petsData); // Ensure pets is always an array
            } catch (error) {
                console.error("Error fetching pets:", error);
                setPets([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
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
                {loading ? (
                    <CircularProgress />
                ) : (
                    (pets).slice(0, 10).map((pet) => (
                        <PetCard pet={pet} />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default HomePage;
