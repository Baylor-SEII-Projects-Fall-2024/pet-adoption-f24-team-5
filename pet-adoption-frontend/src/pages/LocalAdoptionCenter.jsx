import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import axios from 'axios';

export default function AdoptionCenterPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAdoptionCenters = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/users/adoptioncenters', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in the header
                        'Content-Type': 'application/json'
                    }
                });
                setData(response.data);  // Store fetched data in state
            } catch (error) {
                console.error('Error fetching adoption centers:', error);
            } finally {
                setLoading(false);  // Stop loading once data is fetched or an error occurs
            }
        };

        fetchAdoptionCenters();  // Fetch data on mount
    }, []);

    if (loading) {
        return <Typography>Loading adoption centers...</Typography>;
    }

    return (
        <>
            <Head>
                <title>Local Adoption Centers</title>
            </Head>

            <main>
                <Stack
                    sx={{
                        paddingTop: 4,
                        alignItems: 'center',
                        overflow: 'hidden',  // Prevents scroll bars
                    }}
                >
                    <Stack
                        direction="row"
                        gap={2}
                        flexWrap="wrap"  // Ensure the cards wrap instead of causing overflow
                        justifyContent="center"
                    >
                        {data && data.map((center) => (
                            <Card
                                key={center.id}  // Ensure a unique key is provided
                                sx={{
                                    width: 300,
                                    backgroundColor: '#3f51b5',
                                    color: '#fff',
                                    transition: '0.3s',
                                    '&:hover': {
                                        boxShadow: 8,  // Increase shadow on hover
                                        transform: 'scale(1.05)',  // Slightly scale the card on hover
                                    }
                                }}
                                elevation={4}
                            >
                                <CardContent>
                                    <Typography variant="h5" align="center">
                                        {center.centerName}  {/* Display center name */}
                                    </Typography>
                                    <Typography variant="body2" align="center">
                                        {center.centerCity}, {center.centerState}  {/* Display city and state */}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                </Stack>
            </main>
        </>
    );
}
