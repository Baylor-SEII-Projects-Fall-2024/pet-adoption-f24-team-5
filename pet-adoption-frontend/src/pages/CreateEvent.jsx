import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const CreateEvent = () => {
    const [event_name, setEventName] = useState('');
    const [center_id, setCenterID] = useState('');
    const [event_date, setEventDate] = useState(new Date()); // Initialize as Date object
    const [description, setDescription] = useState('');
    const [createEvent, setCreateEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const [noFutureEvents, setNoFutureEvents] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const token = localStorage.getItem('token');

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events', {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

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

        const url = `http://localhost:8080/api/events/delete_event/${selectedEvent.event_id}`;
        try {
            await axios.delete(url, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            alert('Event deleted.');
            fetchEvents();
            resetForm();
            setCreateEvent(false);
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error: could not delete event');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formattedDate = formatDate(event_date);
        const parsedCenterID = parseInt(center_id, 10);

        if (!event_name || isNaN(parsedCenterID) || !description) {
            alert("Please fill out all fields correctly.");
            return;
        }

        const formattedTime = event_date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,  // Use 24-hour format to match "HH:mm" pattern
        });

        const eventData = {
            center_id: parsedCenterID,
            event_name,
            event_date: formattedDate,
            event_time: formattedTime,
            description,
        };

        const url = selectedEvent
            ? `http://localhost:8080/api/events/update_event/${selectedEvent.event_id}`
            : 'http://localhost:8080/api/events/create_event';

        try {
            await (selectedEvent ? axios.put : axios.post)(url, eventData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            alert(selectedEvent ? 'Event updated.' : 'Event created.');
            fetchEvents();
            resetForm();
            setCreateEvent(false);
        } catch (error) {
            console.error('Error registering event:', error.response?.data || error.message);
            alert(`Error: ${error.response?.data?.message || 'could not register event'}`);
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
                    flexBasis: '45%',
                    flexGrow: 1,
                    maxWidth: '600px',
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': { border: '2px solid blue' },
                }}
                elevation={4}
                key={event.event_id}
                onClick={() => {
                    setSelectedEvent(event);
                    setEventName(event.event_name);
                    setCenterID(event.center_id);
                    setEventDate(eventDate); // Set as Date object for DatePicker
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
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Create Event</Typography>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/PostPet">Post Pet</Button>
                    <Button color="inherit" component={Link} to="/LocalAdoptionCenter">Local Adoption Center</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </Box>

            {createEvent && (
                <Box component="form" onSubmit={handleSubmit}>
                    <Button onClick={handleCreateEvent} variant='contained'>Back to Events</Button>
                    {selectedEvent && (
                        <Button onClick={handleDelete} color="error" variant='contained' sx={{ marginLeft: 2 }}>
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