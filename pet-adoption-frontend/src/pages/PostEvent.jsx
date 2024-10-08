import React from 'react'
import {Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PostEvent = () => {
    const [center_id , setCenterID] = React.useState('');
    const [event_date , setEventDate] = React.useState(new Date());
    const [description, setDescription] = React.useState('');
    const [postEvent, setPostEvent] = React.useState(false);
    const [events, setEvents] = React.useState(
        [
            {name: "Event name 1", description: "description of event"},
            {name: "Event name 2", description: "description of event"},
            {name: "Event name 3", description: "description of event"},
            {name: "Event name 4", description: "description of event"},

        ]
    );

    const handleCenterID = () => {setCenterID(center_id);}
    const handleEventDate = () =>{setEventDate(event_date);}
    const handleDescription = () => {setDescription(description);}
    const handlePostEvent = () => {setPostEvent(!postEvent);}

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
                        Post Event
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </Box>



            {postEvent && (
                <Box component="form">
                    <Button onClick={handlePostEvent} variant='contained'>Back to Events</Button>

                    <Stack spacing={2}>
                        <TextField
                            label="Center ID"
                            value={center_id}
                            onChange={(e) => setCenterID(e.target.value)}
                            required
                            fullWidth
                        />
                        <DatePicker
                            selected={event_date}
                            onChange={(event_date) => setEventDate(event_date)}
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
                        <Button type="submit" variant="contained">Post</Button>
                    </Stack>
                </Box>
            )}

            {!postEvent && (
                <Stack sx={{paddingTop:4}} alignItems='center' gap={5}>
                    <Button onClick={handlePostEvent} color='inherit' variant='contained'>Post Event</Button>

                    {events.map((event) => (
                        <EventCard event={event} key={event.name} />
                    ))}
                </Stack>)
            }
        </Box>
    );
};

export default PostEvent