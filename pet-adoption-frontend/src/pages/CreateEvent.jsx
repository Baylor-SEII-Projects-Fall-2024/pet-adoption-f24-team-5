import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_URL } from "@/constants";
import { useSelector } from 'react-redux';
import TitleBar from "@/components/TitleBar";

const CreateEvent = () => {
    const [event_name, setEventName] = React.useState('');
    const [center_id, setCenterID] = React.useState('');
    const [event_date, setEventDate] = React.useState(new Date()); // LocalDate as Date object for ease
    const [event_time, setEventTime] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [createEvent, setCreateEvent] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const [noFutureEvents, setNoFutureEvents] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState(null);
    const token = useSelector((state) => state.user.token);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/events`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            console.log("Fetched Events:", response.data);

            const now = new Date();
            const parseEventDate = (dateString) => {
                const [day, month, year] = dateString.split('/');
                return new Date(year, month - 1, day);
            };

            const filteredEvents = response.data.filter((event) => {
                if (!event.event_date) return false;

                const eventDate = parseEventDate(event.event_date);
                return eventDate >= now;
            });

            const sortedEvents = filteredEvents.sort((a, b) => {
                const aDate = parseEventDate(a.event_date);
                const bDate = parseEventDate(b.event_date);
                return aDate - bDate;
            });

            setEvents(sortedEvents);
            setNoFutureEvents(sortedEvents.length === 0);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const resetForm = () => {
        setEventName('');
        setCenterID('');
        setEventDate(new Date());
        setDescription('');
        setSelectedEvent(null);
    };

    const handleDelete = async () => {
        if (!selectedEvent) {
            alert('No event selected for deletion.');
            return;
        }

        const url = `${API_URL}/api/events/delete_event/${selectedEvent.event_id}`;
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            alert('Event deleted.');
            fetchEvents(); // Refresh the events list after deletion
            resetForm(); // Reset the form fields and selected event
            setCreateEvent(false); // Close the create/edit view if open
        } catch (error) {
            console.error('Error: could not delete event:', error);
            alert('Error: could not delete event');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedDate = formatDate(event_date); // Format event_date as dd/MM/yyyy
        const parsedCenterID = parseInt(center_id, 10);


        // Validate required fields
        if (!event_name || isNaN(parsedCenterID) || !description) {
            alert("Please fill out all fields correctly.");
            return;
        }
        setEventTime(event_date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }))
        const eventData = {
            center_id: parsedCenterID,
            event_name,
            event_date: formattedDate, // Send formatted date
            event_time,
            description,
        };


        console.log('Event Data', eventData);

        const url = selectedEvent
            ? `${API_URL}/api/events/update_event/${selectedEvent.event_id}`
            : `${API_URL}/api/events/create_event`;

        try {
            const response = await (selectedEvent ? axios.put : axios.post)(url, eventData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            alert(selectedEvent ? 'Event updated.' : `Event created. Event ID is: ${response.data}`);
            fetchEvents();
            resetForm();
            setCreateEvent(false);
        } catch (error) {
            console.error('Error: could not register event:', error);
            alert('Error: could not register event');
        }
    };

    const handleCreateEvent = () => {
        setCreateEvent(!createEvent);
        if (createEvent) resetForm();
    };

    const EventCard = ({ event }) => {
        const [day, month, year] = event.event_date.split('/');
        const eventDate = new Date(year, month - 1, day);

        return (
            <Card
                sx={{
                    flexBasis: '45%', // Takes about half the row space
                    flexGrow: 1,
                    maxWidth: '600px', // Controls maximum card width
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': {
                        border: '2px solid blue',
                    },
                }}
                elevation={4}
                key={event.event_id}
                onClick={() => {
                    setSelectedEvent(event);
                    setEventName(event.event_name);
                    setCenterID(event.center_id);
                    setEventDate(event.event_date);
                    setEventTime(event.event_time);
                    setDescription(event.description);
                    setCreateEvent(true);
                }}
            >
                <CardContent>
                    <Typography variant='h5' align='center'>{event.event_name || "Unnamed Event"}</Typography>
                    <Typography variant='body1' align='center'>{event.description}</Typography>
                    <Typography variant='body2' align='center'>{`${day}/${month}/${year}`}</Typography>
                    <Typography variant='body2' align='center' color="textSecondary"> {`Time: ${event.event_time || "N/A"}`}</Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '8vh', width: '100vw', backgroundColor: 'primary.main' }}>
                <TitleBar />
            </Box>

            {createEvent && (
                <Box component="form" onSubmit={handleSubmit}>
                    <Button onClick={handleCreateEvent} variant='contained'>Back to Events</Button>

                    {/* Render Delete Button only if an event is selected */}
                    {selectedEvent && (
                        <Button
                            onClick={handleDelete}
                            color="error"
                            variant='contained'
                            sx={{ marginLeft: 2 }}
                        >
                            Delete Event
                        </Button>
                    )}

                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                        <TextField label="Event Name" value={event_name} onChange={(e) => setEventName(e.target.value)} required fullWidth />
                        <TextField label="Center ID" value={center_id} onChange={(e) => setCenterID(e.target.value)} required fullWidth />
                        <DatePicker
                            selected={event_date}
                            onChange={(date) => setEventDate(date)}
                            required
                            fullWidth
                            showTimeSelect
                            dateFormat="Pp"
                            customInput={<TextField label="Event Date" fullWidth />}
                        />
                        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth />
                        <Button type="submit" variant='contained'>{selectedEvent ? 'Update Event' : 'Post Event'}</Button>
                    </Stack>
                </Box>
            )}

            {!createEvent && (
                <Stack sx={{ paddingTop: 4, maxWidth: '1200px', margin: '0 auto' }} alignItems='center' gap={5}>
                    <Button onClick={handleCreateEvent} color='inherit' variant='contained'>Create Event</Button>
                    {noFutureEvents ? (
                        <Typography variant="h6" color="error">No future events</Typography>
                    ) : (
                        <Stack spacing={2} direction='row' flexWrap='wrap' justifyContent='center'>
                            {events.map(event => (
                                <EventCard key={event.event_id} event={event} />
                            ))}
                        </Stack>
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default CreateEvent;