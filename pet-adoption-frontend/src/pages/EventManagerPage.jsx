import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../utils/redux/axiosConfig";
import { API_URL } from "@/constants";
import TitleBar from "@/components/titleBar/TitleBar";
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import EventCard from "@/components/eventCard/EventCard";
import EventFormComponent from "@/components/eventForm/EventFormComponent";
import { getEvents } from "@/utils/event/getEvents";
import { getCenterName } from "@/utils/user/center/getCenterName";
import { getCenterEvents } from "@/utils/user/center/getCenterEvents";

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
                response = await getEvents(token);
            } else {
                response = await getCenterEvents(token, getSubjectFromToken(token));
            }

            const eventsWithCenterNames = await Promise.all(
                events.map(async (event) => {
                    const centerName = await getCenterName(token, event.center_id);
                    return { ...event, center_name: centerName };
                })
            );

            setEvents(eventsWithCenterNames);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!createNewEvent) {
            handleFetchEvents();
            setFormType('');
        }
    }, [createNewEvent]);

    return (
        <Box>
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