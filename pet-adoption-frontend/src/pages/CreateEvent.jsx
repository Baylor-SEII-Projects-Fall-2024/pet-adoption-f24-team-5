import React, { useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField } from "@mui/material";
import {Link, Route} from "react-router-dom";
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
            console.log("Current date and time:", now);

            const parseEventDate = (dateString) => {
                // Check for "dd/MM/yyyy" format
                const dateParts = dateString.split('/');
                if (dateParts.length === 3) {
                    const day = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
                    const year = parseInt(dateParts[2], 10);
                    return new Date(year, month, day);
                }
                return new Date(dateString); // Default parsing for other formats
            };

            const filteredEvents = response.data.filter((event) => {
                if (!event.event_date || !event.event_time) {
                    console.warn("Skipping event due to missing date/time:", event);
                    return false;
                }

                const eventDate = parseEventDate(event.event_date);
                if (isNaN(eventDate.getTime())) {
                    console.warn("Invalid event date format for:", event);
                    return false;
                }
                console.log("Parsed event date:", eventDate);

                // Parse time and handle AM/PM
                const [time, period] = event.event_time.split(' ');
                const [hour, minute] = time.split(':').map(Number);
                const eventHour = period === 'PM' && hour !== 12 ? hour + 12 : hour;
                const eventDateTime = new Date(eventDate);
                eventDateTime.setHours(eventHour, minute);

                if (isNaN(eventDateTime.getTime())) {
                    console.warn("Invalid event time format for:", event);
                    return false;
                }
                console.log(`Combined event DateTime for ${event.event_name}:`, eventDateTime);

                return eventDate.toDateString() === now.toDateString()
                    ? eventDateTime > now
                    : eventDateTime > now;
            });

            console.log("Filtered Events:", filteredEvents);

            const sortedFilteredEvents = filteredEvents.sort((a, b) => {
                const aDate = parseEventDate(a.event_date);
                const bDate = parseEventDate(b.event_date);

                const [aTime, aPeriod] = a.event_time.split(' ');
                const [aHour, aMinute] = aTime.split(':').map(Number);
                const aFinalHour = aPeriod === 'PM' && aHour !== 12 ? aHour + 12 : aHour;
                const aDateTime = new Date(aDate);
                aDateTime.setHours(aFinalHour, aMinute);

                const [bTime, bPeriod] = b.event_time.split(' ');
                const [bHour, bMinute] = bTime.split(':').map(Number);
                const bFinalHour = bPeriod === 'PM' && bHour !== 12 ? bHour + 12 : bHour;
                const bDateTime = new Date(bDate);
                bDateTime.setHours(bFinalHour, bMinute);

                return aDateTime - bDateTime;
            });

            setEvents(sortedFilteredEvents);
            console.log("Sorted Events:", sortedFilteredEvents);
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

        const day = String(event_fullDate.getDate()).padStart(2, '0'); // Get day
        const month = String(event_fullDate.getMonth() + 1).padStart(2, '0'); // Get month (0-based)
        const year = event_fullDate.getFullYear(); // Get full year
        const event_date = `${day}/${month}/${year}`; // Format to dd/MM/yyyy
        const event_time = event_fullDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Format to hh:mm AM/PM
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
            event_date, // Should be in dd/MM/yyyy format
            event_time,  // Should be in hh:mm AM/PM format
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
        // Ensure consistent parsing of dd/MM/yyyy format
        const [day, month, year] = event.event_date.split('/');
        const eventDate = new Date(year, month - 1, day); // Convert to JavaScript Date

        return (
            <Card
                sx={{
                    width: '48%',
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
                    setEventFullDate(eventDate);
                    setDescription(event.description);
                    setCreateEvent(true);
                }}
            >
                <CardContent>
                    <Typography variant='h5' align='center'>{event.event_name || "Unnamed Event"}</Typography>
                    <Typography variant='body1' align='center'>{event.description}</Typography>
                    <Typography variant='body2' align='center'>
                        {`${day}/${month}/${year}`} at {event.event_time} {/* Corrected format */}
                    </Typography>
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
                        <Button type="submit" variant='contained'>{selectedEvent ? 'Update Event' : 'Post Event'}</Button>
                    </Stack>
                </Box>
            )}

            {!createEvent && (
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={5}>
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