import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const CreateEvent = () => {
    const [event_id, setEventID] = React.useState(0);
    const [event_name, setEventName] = React.useState('');
    const [center_id, setCenterID] = React.useState('');
    const [event_fullDate, setEventFullDate] = React.useState(new Date());
    const [description, setDescription] = React.useState('');
    const [createEvent, setCreateEvent] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const [noFutureEvents, setNoFutureEvents] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState(null);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            console.log("Fetched Events:", response.data);

            const now = new Date();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const filteredEvents = response.data.filter((event) => {
                const eventDate = new Date(event.event_date);
                if (eventDate.toDateString() === today.toDateString()) {
                    return eventDate > now; // Only include events after the current time
                }
                return eventDate > today; // Include future events
            });

            const sortedFilteredEvents = filteredEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
            setEvents(sortedFilteredEvents);
            setNoFutureEvents(sortedFilteredEvents.length === 0);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("Could not fetch events.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const resetForm = () => {
        setEventName('');
        setCenterID('');
        setEventFullDate(new Date());
        setDescription('');
        setSelectedEvent(null);
    };

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent default form submission

        const event_date = event_fullDate.toISOString();
        const event_time = event_fullDate.toLocaleTimeString('en-GB', { hour12: false });
        const parsedCenterID = parseInt(center_id, 10);

        if(event_name.length === 0) {
            alert("Please enter an event name");
            return;
        }
        if (isNaN(parsedCenterID)) {
            alert("Center ID must be a number");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const now = new Date();

        const isToday = event_fullDate.toDateString() === today.toDateString();

        if (isToday && event_fullDate <= now) {
            alert("For today's date, please select a future time.");
            return;
        }

        if(description.length === 0) {
            alert("Please enter a description");
            return;
        }

        const eventData = {
            center_id: parsedCenterID,
            event_name,
            event_date,
            event_time,
            description,
        };

        console.log('Event Data', eventData);

        const url = selectedEvent
            ? `http://localhost:8080/api/events/update_event/${selectedEvent.event_id}` // Update URL
            : 'http://localhost:8080/api/events/create_event'; // Create URL

        const axiosMethod = selectedEvent ? axios.put : axios.post; // Decide on method

        axiosMethod(url, eventData)
            .then((res) => {
                alert(selectedEvent ? 'Event updated.' : 'Event created. Event ID is: ' + res.data);
                fetchEvents(); // Refresh the event list
                handleCreateEvent(); // Reset form view
                resetForm(); // Reset form fields
            })
            .catch((error) => {
                console.error('Error: could not register event: ', error);
                alert('Error: could not register event');
            });
    };

    const handleCreateEvent = () => {
        setCreateEvent(!createEvent);
        if (createEvent) resetForm(); // Reset when switching to view mode
    }

    const EventCard = ({ event }) => {
        return (
            <Card
                sx={{
                    width: '48%',
                    backgroundColor: 'white', // Normal background color
                    transition: 'border 0.3s', // Smooth transition for the border
                    '&:hover': {
                        border: '2px solid blue', // Border on hover
                    },
                }}
                elevation={4}
                key={event.event_id} // Use event_id as key
                onClick={() => {
                    setSelectedEvent(event); // Set selected event
                    setEventName(event.event_name); // Populate form fields
                    setCenterID(event.center_id); // Populate form fields
                    setEventFullDate(new Date(event.event_date)); // Populate form fields
                    setDescription(event.description); // Populate form fields
                    setCreateEvent(true); // Switch to create/edit form
                }}
            >
                <CardContent>
                    <Typography variant='h5' align='center'>{event.event_name || "Unnamed Event"}</Typography>
                    <Typography variant='body1' align='center'>{event.description}</Typography>
                    <Typography variant='body2' align='center'>{new Date(event.event_date).toLocaleString()}</Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '8vh', width: '100vw', backgroundColor: 'primary.main' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Create Event
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </Box>

            {createEvent && (
                <Box component="form" onSubmit={handleSubmit}>
                    <Button onClick={handleCreateEvent} variant='contained'>Back to Events</Button>

                    <Stack spacing={2}>
                        <TextField
                            label="Event Name"
                            value={event_name}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Center ID"
                            value={center_id}
                            onChange={(e) => setCenterID(e.target.value)}
                            required
                            fullWidth
                        />
                        <DatePicker
                            selected={event_fullDate}
                            onChange={(date) => setEventFullDate(date)}
                            required
                            fullWidth
                            showTimeSelect
                            dateFormat="Pp"
                            customInput={<TextField label="Event Date" fullWidth />}
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            fullWidth
                        />
                        <Button type="submit" variant='contained'>{selectedEvent ? 'Update Event' : 'Post Event'}</Button> {/* Button text changes based on mode */}
                    </Stack>
                </Box>
            )}

            {!createEvent && (
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={5}>
                    <Button onClick={handleCreateEvent} color='inherit' variant='contained'>Create Event</Button>

                    {noFutureEvents ? (
                        <Typography variant="h6" color="error">No future events</Typography>
                    ) : (
                        events.map((event, index) => (
                            <EventCard event={event} key={event.event_id || index} /> // Use event_id for keys
                        ))
                    )}
                </Stack>
            )}
        </Box>
    );
};

export default CreateEvent;