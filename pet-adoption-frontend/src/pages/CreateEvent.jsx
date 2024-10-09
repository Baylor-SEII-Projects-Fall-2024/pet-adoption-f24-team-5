import React from 'react'
import {Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


const CreateEvent = () => {
    const [center_id , setCenterID] = React.useState('');
    const [event_fullDate , setEventFullDate] = React.useState(new Date());
    const [description, setDescription] = React.useState('');
    const [createEvent, setCreateEvent] = React.useState(false);
    const [events, setEvents] = React.useState(
        [
            {name: "Event name 1", description: "description of event"},
            {name: "Event name 2", description: "description of event"},
            {name: "Event name 3", description: "description of event"},
            {name: "Event name 4", description: "description of event"},

        ]
    );

    const handleSubmit = (event) => {
        const event_date = event_fullDate.toISOString();
        const event_time = event_fullDate.toLocaleTimeString('en-GB', { hour12: false });
        const parsedCenterID = parseInt(center_id, 10);
        if (isNaN(parsedCenterID)) {
            alert("Center ID must be a number");
            return;
        }
        event.preventDefault();

        const eventData = {
            center_id: parsedCenterID,
            event_date,
            event_time,
            description
        }
        console.log('Event Data', eventData);
        const url = 'http://localhost:8080/api/events/create_event';
        axios.post(url, eventData)
            .then((res) => {
            alert('Event created. Event ID is: ' + res.data);
        })
            .catch((error) => {
                console.error('Error: could not register event: ', error);
                alert('Error: could not register event');
                alert(error);
            });
    };
    const handleCreateEvent = () => {setCreateEvent(!createEvent);}

    const EventCard = ({ event }) => (
        <Card sx={{ width: '48%' }} elevation={4} key={event.name}>
            <CardContent>
                <Typography variant='h5' align='center'>{event.name}</Typography>
                <Typography variant='body1' align='center'>{event.description}</Typography>
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
                            label="Center ID"
                            value={center_id}
                            onChange={(e) => setCenterID(e.target.value)}
                            required
                            fullWidth
                        />
                        <DatePicker
                            selected={event_fullDate}
                            onChange={(date) => setEventFullDate(date)}
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

                    {events.map((event) => (
                        <EventCard event={event} key={event.name} />
                    ))}
                </Stack>)
            }
        </Box>
    );
};

export default CreateEvent