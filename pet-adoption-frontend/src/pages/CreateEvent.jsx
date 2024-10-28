import React, {useEffect, useState} from 'react';
import {Box, Button, Stack, CircularProgress} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {API_URL} from "@/constants";
import TitleBar from "@/components/TitleBar";
import {getAuthorityFromToken, getSubjectFromToken} from "@/utils/tokenUtils";
import {useSelector} from "react-redux";
import EventCard from "@/components/EventCard";
import EventFormComponent from "@/components/EventFormComponent";

const CreateEvent = () => {
    const [formType, setFormType] = React.useState('');
    const [formEvent, setFormEvent] = React.useState({});
    const [createEvent, setCreateEvent] = useState(false);
    const [events,  setEvents] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [loading, setLoading] = React.useState(true);

    const handleCardClick = (event) => {
        if (getAuthorityFromToken(token) !== "Owner") {
            setFormEvent(event);
            setFormType("update");
            setCreateEvent((!createEvent));
        }
    };

    const handleCreateEvent = () => {
        setCreateEvent(!createEvent);
        setFormType("save");
        setFormEvent({});
    };
    const handleFetchEvents = async () => {
        setLoading(true);
        setEvents([]);
        let response;
        try {
            console.log("Fetching events...");
            if (getAuthorityFromToken(token) === "Owner") {
                await axios.get(`${API_URL}/api/events`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }).then((res) => {
                    console.log(res.data);
                });
            } else {
                await axios.get(`${API_URL}/api/events/getCenterEvents/${getSubjectFromToken(token)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }).then((res) => {
                    console.log("Fetched Events...", res.data);
                    response = res;
                });
            }
            const eventsWithCenterNames = await Promise.all(
                response.data.map(async (event) => {
                    const centerName = await fetchAdoptionCenterName(event.center_id);
                    return { ...event, center_name: centerName };
                })
            );

            setEvents(eventsWithCenterNames);
            //setNoFutureEvents(eventsWithCenterNames.length === 0);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };
    const fetchAdoptionCenterName = async (center_Id) => {
        try {
            const response = await axios.get(`${API_URL}/api/users/getAdoptionCenter/${center_Id}`, {
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
        if(createEvent === false) {
            handleFetchEvents().then((res) => {
                if (res) {
                    console.log(res.data);
                }
            });
            setFormType('')
        }
    },[createEvent]);

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <TitleBar/>

            {createEvent && (
                <EventFormComponent type={formType} handleCreateEvent={handleCreateEvent} event={formEvent} />
            )}

            {!createEvent &&
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={5}>
                    <Button onClick={handleCreateEvent} color='inherit' variant='contained'>Post Event</Button>

                    {loading ? <CircularProgress /> :
                        ((events.length > 0) && events.map((event) => (
                            <EventCard event={event} key={event.event_id} onClick={() => handleCardClick(event)} />
                        )))
                    }
                </Stack>
            }
        </Box>
    );
};

export default CreateEvent;