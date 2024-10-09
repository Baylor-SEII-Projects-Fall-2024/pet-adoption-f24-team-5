import React, {useEffect} from 'react'
import {Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


const CreateEvent = () => {
    const [event_name , setEventName] = React.useState('');
    const [center_id , setCenterID] = React.useState('');
    const [event_fullDate , setEventFullDate] = React.useState(new Date());
    const [description, setDescription] = React.useState('');
    const [createEvent, setCreateEvent] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const [noFutureEvents, setNoFutureEvents] = React.useState(false); // State for no future events message

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/events');
            console.log("Fetched Events:", response.data);

            // Get current date and time
            const now = new Date();
            // Get today's date without time for comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Filter events
            const filteredEvents = response.data.filter((event) => {
                const eventDate = new Date(event.event_date); // Assuming event.event_date is in a format recognized by Date

                // If event date is today, check if event time is after the current time
                if (eventDate.toDateString() === today.toDateString()) {
                    return eventDate > now; // Only include events after the current time
                }

                // Otherwise, include events that are in the future
                return eventDate > today;
            });

            // Sort the filtered events by date
            const sortedFilteredEvents = filteredEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

            // Update state with filtered and sorted events
            setEvents(sortedFilteredEvents);
            setNoFutureEvents(sortedFilteredEvents.length === 0); // Update noFutureEvents based on the filtered result
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("Could not fetch events.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = (event) => {
        const event_date = event_fullDate.toISOString();
        const event_time = event_fullDate.toLocaleTimeString('en-GB', { hour12: false });
        const parsedCenterID = parseInt(center_id, 10);

        if (isNaN(parsedCenterID)) {
            alert("Center ID must be a number");
            return;
        }
        // Get today's date at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Set current date and time for future time validation
        const now = new Date();

        // Check if selected date is today
        const isToday = event_fullDate.toDateString() === today.toDateString();

        // If date is today, check if time is in the future
        if (isToday && event_fullDate <= now) {
            alert("For today's date, please select a future time.");
            return;
        }
        event.preventDefault();

        const eventData = {
            center_id: parsedCenterID,
            event_name,
            event_date,
            event_time,
            description
        }
        console.log('Event Data', eventData);
        const url = 'http://localhost:8080/api/events/create_event';
        axios.post(url, eventData)
            .then((res) => {
            alert('Event created. Event ID is: ' + res.data);
            fetchEvents();
            handleCreateEvent();
        })
            .catch((error) => {
                console.error('Error: could not register event: ', error);
                alert('Error: could not register event');
                alert(error);
            });
    };
    const handleCreateEvent = () => {setCreateEvent(!createEvent);}

    const EventCard = ({ event }) => (
        <Card sx={{ width: '48%' }} elevation={4} key={event.event_date}>
            <CardContent>
                <Typography variant='h5' align='center'>{event.event_name || "Unnamed Event"}</Typography>
                <Typography variant='body1' align='center'>{event.description}</Typography>
                <Typography variant='body2' align='center'>{new Date(event.event_date).toLocaleString()}</Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
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
                <Box component="form">
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
                            fullwidth
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
                        <Button onClick={(event) => handleSubmit(event)} variant='contained'>Post Event</Button>
                    </Stack>
                </Box>
            )}

            {!createEvent && (
                <Stack sx={{paddingTop:4}} alignItems='center' gap={5}>
                    <Button onClick={handleCreateEvent} color='inherit' variant='contained'>Create Event</Button>

                    {noFutureEvents ? ( // Conditional rendering based on noFutureEvents state
                        <Typography variant="h6" color="error">No future events</Typography>
                    ) : (
                        events.map((event, index) => (
                            <EventCard event={event} key={event.event_date || index} />
                        ))
                    )}
                </Stack>)
            }
        </Box>
    );
};

export default CreateEvent