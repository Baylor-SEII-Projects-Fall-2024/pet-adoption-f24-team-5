import React from 'react';
import Head from 'next/head';
import { AppBar, Box, Button, Card, CardContent, Stack, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '@/styles/Home.module.css';

const HomePage = () => {
    const [events, setEvents] = useState(
        [
            { name: "Dog Pile", description: "This page will show all of the events and the main way you use the app and will show differently if you are a center or user" },
            { name: "Cat Pile", description: "This page will show all of the events and the main way you use the app and will show differently if you are a center or user" },
            { name: "Other Pile", description: "This page will show all of the events and the main way you use the app and will show differently if you are a center or user" }
        ]);

    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <AppBar position="static" sx={{ height: '8vh' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Pet Adoption
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ height: '92vh', display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ width: '30vw', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid black' }}>
                    <Stack sx={{ padding: 2 }} alignItems='center' gap={2}>
                        {events.map((event) => (
                            <Card sx={{ width: '100%' }} elevation={4} key={event.name}>
                                <CardContent>
                                    <Typography variant='h5' align='center'>{event.name}</Typography>
                                    <Typography variant='body2' align='center'>{event.description}</Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Box>
                <Box sx={{ width: '70vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                        <Card sx={{ width: '100%' }} elevation={4}>
                            <CardContent>
                                <Typography variant='h3' align='center'>Dog Pile</Typography>
                            </CardContent>
                        </Card>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}

export default HomePage;