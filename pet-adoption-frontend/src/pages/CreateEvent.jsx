import React, {useEffect, useState} from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {API_URL} from "@/constants";
import TitleBar from "@/components/TitleBar";

const CreateEvent = () => {
    const [event_name, setEventName] = useState('');
    const [center_id, setCenterID] = useState(0);
    const [event_date, setEventDate] = useState(new Date());
    const [event_time, setEventTime] = useState(() => new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }));
    const [event_description, setEventDescription] = useState('');
    const [createEvent, setCreateEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const [noFutureEvents, setNoFutureEvents] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const token = localStorage.getItem('token');
    const EventCard = ({ event }) => {
        console.log("Creating event card...");
        const [day, month, year] = event.event_date.split('/');
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
                    console.log("Setting event...");
                    setSelectedEvent(event);
                    console.log("Success!");

                    console.log("Setting event name...");
                    setEventName(event.event_name);
                    console.log("Success!");

                    console.log("Setting center ID...");
                    setCenterID(event.center_id);
                    console.log("Success!");

                    console.log("Setting event date...");
                    setEventDate(handleDateStringToDate(event.event_date));
                    console.log("Success!");

                    console.log("Setting event time...");
                    setEventTime(event.event_time);
                    console.log("Success!");

                    console.log("Setting event description...");
                    setEventDescription(event.description);
                    console.log("Success!");

                    console.log("Setting create event...");
                    setCreateEvent(true);
                    console.log("Success!");
                }}
            >
                <CardContent>
                    <Typography variant='h5' align='center'>
                        {event.event_name}
                    </Typography>
                    <Typography variant='body1' align='center'>
                        {event.description}
                    </Typography>
                    <Typography variant='body2' align='center'>
                        {`${day}/${month}/${year}`}
                    </Typography>
                    <Typography variant='body2' align='center' color="textSecondary">
                        {`Time: ${event.event_time ? event.event_time : "N/A"}`}
                    </Typography>
                </CardContent>
            </Card>
        );
    };
    const resetForm = () => {
        setEventName('');
        setCenterID(0);
        handleDateChange(new Date())
        setEventDescription('');
        setSelectedEvent(null);
    };
    const handleValidateSetEvent = (displayAlert) => {
        if(event_name && !isNaN(center_id) && event_date && event_time && event_description) {
            return true;
        }
        if(displayAlert) {
            if(!event_name) {
                alert("Please enter an event name");
            }
            else if(isNaN(center_id)) {
                alert("Invalid Center_ID");
            }
            else if(!event_date) {
                alert("Please enter an event date");
            }
            else if(!event_time) {
                alert("Please enter an event time");
            }
            else if(!event_description) {
                alert("Please enter an event description");
            }
            else alert("Unknown error when validating event");
        }
        return false;
    }
    const handleCreateEvent = () => {
        setCreateEvent(!createEvent);
        if (createEvent) {
            resetForm();
            handleFetchEvents();
        }
    };
    const handleDateStringToDate = (dateString) => {
        console.log("Converting dateString to date...")
        const [day, month, year] = dateString.split('/');
        const newDate = new Date(year, month - 1, day);
        console.log("Original date: " + dateString + " | New date: " + newDate);

        return newDate;
    }
    const handleTimeStringToTime = (timeString) => {
        console.log("Converting timeString to time...");
        const [hours, minutes] = timeString.split(':');
        const now = new Date();
        now.setHours(parseInt(hours, 10));
        now.setMinutes(parseInt(minutes, 10));
        console.log("Original time: " + timeString + " | New time: " + now);
        return now;
    }
    const handleDateToTimeString = (selectedDate) => {
        console.log("Converting date to time string...");
        // Check if selectedDate is valid before proceeding
        if (!selectedDate) {
            console.error("No date provided.");
            return "Invalid time";
        }

        // Attempt to convert to Date if not already a Date object
        const dateObj = selectedDate instanceof Date && !isNaN(selectedDate)
            ? selectedDate
            : new Date(selectedDate);

        // Check if the dateObj is valid
        if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", selectedDate);
            return "Invalid time";
        }

        console.log("Old date: " + selectedDate + " | New date: " + dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        }));

        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };
    const handleDateToString = (selectedDate) => {
        console.log("Converting date to string...");
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        console.log("Old date: " + selectedDate + " | New date: " + `${day}/${month}/${year}`);
        return `${day}/${month}/${year}`;
    }
    const handleCenterIDStringToInt = (centerID) => {
        setCenterID(parseInt(centerID, 10));
    }
    const handleDateChange = (selectedDate) => {
        setEventDate(selectedDate);
        setEventTime(handleDateToTimeString(selectedDate));
    }
    const handleFetchEvents = async () => {
        try {
            console.log("Fetching Events...");
            const response = await axios.get(`${API_URL}/api/events`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            console.log("Fetched Events...", response.data);

            const filteredEvents = response.data.filter((event) => {
                console.log("Filtering event...");

                console.log("Validating event_date...");
                if (!event.event_date) {
                    console.log("Error: " + event.event_date + " is not a date");
                    return false;
                }
                console.log("Success!");

                console.log("Validating event_time...");
                if (!event.event_time) {
                    console.log("Error: " + event.event_time + " is not a time");
                    return false;
                }
                console.log("Success!");

                console.log("Validating event is >= today date...");
                if (handleDateStringToDate(event.event_date) < new Date()) {
                    console.log("event.event_date is before today");
                    return false;
                }
                console.log("Success!");

                console.log("Validating event time is after current time...")
                if (handleDateStringToDate(event.event_date) === new Date()) {
                    console.log("Event is today...");
                    if (handleTimeStringToTime(event.event_time) <
                        handleTimeStringToTime(handleDateToTimeString(new Date()))) {
                        console.log("event.event_time is before current time");
                        return false;
                    }
                }
                console.log("Success!");

                console.log("Returning event validation");
                return true;
            });

            const sortedEvents = filteredEvents.sort((a, b) => {
                return handleDateStringToDate(a.event_date) - handleDateStringToDate(b.event_date);
            });

            setEvents(sortedEvents); // list of events that occur after current date and time
            setNoFutureEvents(sortedEvents.length === 0); // if no events, none will be displayed
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    useEffect(() => {
        handleFetchEvents();
    }, []);
    const handleDelete = async () => {
        if (!selectedEvent) {
            alert('No event selected for deletion.');
            return;
        }
        const url = `${API_URL}/api/events/delete_event/${selectedEvent.event_id}`;
        try {
            await axios.delete(url, {
                headers: {
                   Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'
                }
            });
            alert('Event deleted.');
            handleCreateEvent();
        } catch (error) {
            console.error('Error: could not delete event:', error);
            alert('Error: could not delete event');
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate required fields
        if (!handleValidateSetEvent(true)) {
            return;
        }

        const eventData = {
            center_id,
            event_name,
            event_date: handleDateToString(event_date),
            event_time,
            event_description,
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
            handleCreateEvent();
        } catch (error) {
            console.error('Error: could not register event:', error);
            alert('Error: could not register event');
        }
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ height: '8vh', width: '100vw', backgroundColor: 'primary.main' }}>
                <TitleBar/>
            </Box>

            {createEvent && (
                <Box component="form" onSubmit={handleSubmit}>
                    <Button onClick={handleCreateEvent} variant='contained'>
                        Back to Events
                    </Button>
                    {selectedEvent && (
                        <Button onClick={handleDelete} color="error" variant='contained' sx={{ marginLeft: 2 }}>
                            Delete Event
                        </Button>
                    )}

                    <Stack spacing={2} sx={{ marginTop: 2 }}>
                        <TextField label="Event Name" value={event_name} onChange={(e) => setEventName(e.target.value)} fullWidth />
                        <TextField label="Center ID" value={center_id} onChange={(e) => handleCenterIDStringToInt(e.target.value)} fullWidth />
                        <DatePicker selected={event_date} onChange={(date) => handleDateChange(date)} fullWidth showTimeSelect dateFormat="Pp" customInput={<TextField label="Event Date" fullWidth />}/>
                        <TextField label="Description" value={event_description} onChange={(e) => setEventDescription(e.target.value)} fullWidth />
                        <Button type="submit" variant='contained' disabled={!handleValidateSetEvent(false)}> {selectedEvent ? 'Update Event' : 'Post Event'} </Button>
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