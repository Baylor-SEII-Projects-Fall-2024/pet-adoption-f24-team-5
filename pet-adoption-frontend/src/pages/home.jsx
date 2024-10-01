import React from 'react';
import Head from 'next/head';
import { AppBar, Button, Card, CardContent, Stack, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import styles from '@/styles/Home.module.css';

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Home Page</title>
            </Head>

            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Pet Adoption
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </AppBar>

            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                    <Card sx={{ width: 600 }} elevation={4}>
                        <CardContent>
                            <Typography variant='h3' align='center'>Dog Pile</Typography>
                            <Typography variant='body1' color='text.secondary'>This page will show all of the events and the main way you use the app and will show differently if you are a center or user</Typography>
                        </CardContent>
                    </Card>
                </Stack>
            </main>
        </>
    );
}