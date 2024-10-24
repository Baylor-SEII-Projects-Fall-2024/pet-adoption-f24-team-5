import React, {useEffect, useState} from 'react';
import { Card, CardContent, Typography, Box, Button, Stack, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {API_URL} from "@/constants";
import TitleBar from "@/components/TitleBar";
import {getAuthorityFromToken, getSubjectFromToken} from "@/utils/tokenUtils";
import {useSelector} from "react-redux";

const CreateEvent = () => {
    const [event_name, setEventName] = useState('');
    const [event_date, setEventDate] = useState(new Date());
    const [event_time, setEventTime] = useState(() => new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }));
    const [event_description, setEventDescription] = useState('');
    const [createEvent, setCreateEvent] = useState(false);
    const [events,  setEvents] = useState([]);
    const [noFutureEvents, setNoFutureEvents] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const token = useSelector((state) => state.user.token);

    /*useEffect(() => {

    }, [token]); // Only re-run if the token changes*/
    const EventCard = ({ event }) => {
        console.log("Creating event card...");
        const [day, month, year] = event.event_date.split('/');

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
                    if (getAuthorityFromToken(token) !== "Owner") {
                        setSelectedEvent(event);
                        setEventName(event.event_name);
                        setCenterID(event.center_id);
                        setEventDate(handleDateStringToDate(event.event_date));
                        setEventTime(event.event_time);
                        setEventDescription(event.event_description);
                        setCreateEvent(true);
                    }
                }}
            >
                <CardContent>
                    {getAuthorityFromToken(token) === "Owner" && (
                        <Typography variant="h4" align="center">
                            {event.center_name || "Unknown Center"}
                        </Typography>
                    )}
                    <Typography variant="h5" align="center">
                        {event.event_name}
                    </Typography>
                    <Typography variant="body1" align="center">
                        {event.description}
                    </Typography>
                    <Typography variant="body2" align="center">
                        {`${day}/${month}/${year}`}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                        {`Time: ${event.event_time ? event.event_time : "N/A"}`}
                    </Typography>
                </CardContent>
            </Card>
        );
    };
    const resetForm = () => {
        setEventName('');
        handleDateChange(new Date())
        setEventDescription('');
        setSelectedEvent(null);
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
    const handleFetchEvents = async () => {
        try {
            console.log("Fetching events...");
            let response;
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
            console.log("Fetched Events...", response.data);

            // Fetch adoption center names and attach them to events
            const eventsWithCenterNames = await Promise.all(
                response.data.map(async (event) => {
                    const centerName = await fetchAdoptionCenterName(event.center_id);
                    return { ...event, center_name: centerName };
                })
            );

            setEvents(eventsWithCenterNames);
            setNoFutureEvents(eventsWithCenterNames.length === 0);
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    const handleValidateSetEvent = (displayAlert) => {
        if(event_name && event_date && event_time && event_description) {
            return true;
        }
        if(displayAlert) {
            if(!event_name) {
                alert("Please enter an event name");
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
        }
    };
    const handleDateStringToDate = (dateString) => {
        console.log("Converting dateString to date...");
        const [day, month, year] = dateString.split('/');
        const newDate = new Date(year, month - 1, day);

        // Normalize the time to midnight for accurate date comparison
        newDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000
        console.log("Original date: " + dateString + " | New date: " + newDate);

        return newDate;
    };
    const handleDateToTimeString = (selectedDate) => {
        console.log("Converting date to time string...");

        if (!selectedDate) {
            console.error("No date provided.");
            return "Invalid time";
        }

        const dateObj = selectedDate instanceof Date && !isNaN(selectedDate)
            ? selectedDate
            : new Date(selectedDate);

        if (isNaN(dateObj.getTime())) {
            console.error("Invalid date:", selectedDate);
            return "Invalid time";
        }

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
    const handleDateChange = (selectedDate) => {
        setEventDate(selectedDate);
        setEventTime(handleDateToTimeString(selectedDate));
    }
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
            await handleFetchEvents();
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
        const centerID = -1;
        event = {
            centerID,
            event_name,
            event_date: handleDateToString(event_date),
            event_time,
            event_description,
        };
        console.log('Event Data: ', event);

        const url = selectedEvent
            ? `${API_URL}/api/events/update_event/${selectedEvent.event_id}`
            : `${API_URL}/api/events/create_event/${getSubjectFromToken(token)}`;

        try {
            const response = await (selectedEvent ? axios.put : axios.post)(url, event, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                }
            });
            alert(selectedEvent ? 'Event updated.' : `Event created. Event ID is: ${response.data}`);
            await handleFetchEvents();
            handleCreateEvent();
        } catch (error) {
            console.error('Error: could not register event:', error);
            alert('Error: could not register event');
        }
    };

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <TitleBar/>


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
                        <DatePicker selected={event_date} onChange={(date) => handleDateChange(date)} fullWidth showTimeSelect dateFormat="Pp" customInput={<TextField label="Event Date" fullWidth />}/>
                        <TextField label="Description" value={event_description} onChange={(e) => setEventDescription(e.target.value)} fullWidth />
                        <Button type="submit" variant='contained' disabled={!handleValidateSetEvent(false)}> {selectedEvent ? 'Update Event' : 'Post Event'} </Button>
                    </Stack>
                </Box>
            )}

            {!createEvent && (
                <Stack sx={{ paddingTop: 4, maxWidth: '1200px', margin: '0 auto' }} alignItems='center' gap={5}>
                    {getAuthorityFromToken(token) !== "Owner" && (
                        <Button onClick={handleCreateEvent} color='inherit' variant='contained'>
                            Create Event
                        </Button>
                    )}
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