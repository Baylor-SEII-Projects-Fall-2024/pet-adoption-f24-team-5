import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_URL } from "@/constants";
import TitleBar from "@/components/TitleBar";
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector } from "react-redux";
import EventCard from "@/components/EventCard";
import EventFormComponent from "@/components/EventFormComponent";

const EventManager = () => {
    const [formType, setFormType] = useState('');
    const [formEvent, setFormEvent] = useState({});
    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [loading, setLoading] = useState(true);

    const handleCardClick = (event) => {
        if (getAuthorityFromToken(token) !== "Owner") {
            setFormEvent(event);
            setFormType("update");
            setCreateNewEvent(!createNewEvent);
        }
    };

    const handleCreateNewEvent = () => {
        setCreateNewEvent(!createNewEvent);
        setFormType("save");
        setFormEvent({});
    };

    const handleFetchEvents = async () => {
        setLoading(true);
        try {
            let response;
            console.log("Fetching events...");

            if (getAuthorityFromToken(token) === "Owner") {
                response = await axios.get(`${API_URL}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                response = await axios.get(`${API_URL}/api/events/getCenterEvents/${getSubjectFromToken(token)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }

            const eventsWithCenterNames = await Promise.all(
                response.data.map(async (event) => {
                    const centerName = await fetchAdoptionCenterName(event.center_id);
                    return { ...event, center_name: centerName };
                })
            );

            setEvents(eventsWithCenterNames);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert(`Error: ${error.response?.status} - ${error.response?.statusText}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdoptionCenterName = async (centerId) => {
        try {
            const response = await axios.get(`${API_URL}/api/users/getAdoptionCenter/${centerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.centerName; // Assuming the response contains the name
        } catch (error) {
            console.error("Failed to fetch adoption center name:", error);
            return "Unknown Center"; // Default value in case of an error
        }
    };

    useEffect(() => {
        if (!createNewEvent) {
            handleFetchEvents();
            setFormType('');
        }
    }, [createNewEvent]);

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <TitleBar />

            {createNewEvent && (
                <EventFormComponent type={formType} handleCreateNewEvent={handleCreateNewEvent} event={formEvent} />
            )}

            {!createNewEvent && (
                <Stack sx={{ paddingTop: 4 }} alignItems="center" gap={5}>
                    <Button onClick={handleCreateNewEvent} color="inherit" variant="contained">
                        Post Event
                    </Button>

                    {loading ? <CircularProgress /> :
                        ((events.length > 0) && events.map((event) => (
                            <EventCard event={event} key={event.event_id} onClick={() => handleCardClick(event)} />
                        )))
                    }
                </Stack>
            )}
        </Box>
    );
};

export default EventManager