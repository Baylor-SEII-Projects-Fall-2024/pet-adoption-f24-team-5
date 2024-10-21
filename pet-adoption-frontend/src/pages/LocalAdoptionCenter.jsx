import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import AdoptionCenterCard from '../components/AdoptionCenterCard';
import axios from 'axios';
import { getSubjectFromToken } from '../utils/tokenUtils'; // Import the function
import {API_URL, FRONTEND_URL} from "@/constants";
import TitleBar from "@/components/TitleBar";

export default function AdoptionCenterPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null); // State to store the user email
    const token = localStorage.getItem('token');


    useEffect(() => {
        // Extract user email (subject) from the token
        if (token) {
            const subject = getSubjectFromToken(token); // Use the provided function
            if (subject) {
                setUserEmail(subject); // Store the user email (subject)
            }
        }

        // Fetch adoption centers
        const fetchAdoptionCenters = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/users/adoptioncenters`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in the header
                        'Content-Type': 'application/json',
                    },
                });
                setData(response.data); // Store fetched data in state
                console.log(data);
            } catch (error) {
                console.error('Error fetching adoption centers:', error);
            } finally {
                setLoading(false); // Stop loading once data is fetched or an error occurs
            }
        };

        fetchAdoptionCenters(); // Fetch data on mount
    }, [token]);

    if (loading) {
        return <Typography>Loading adoption centers...</Typography>;
    }

    return (
        <>
            <TitleBar/>
            <Head>
                <title>Local Adoption Centers</title>
            </Head>

            <main>
                <Stack
                    sx={{
                        paddingTop: 4,
                        alignItems: 'center',
                        overflow: 'hidden', // Prevents scroll bars
                    }}
                >
                    {/* Display user email if available */}
                    {userEmail && (
                        <Typography variant="h6" align="center">
                            Welcome, {userEmail}!
                        </Typography>
                    )}

                    <Stack
                        direction="row"
                        gap={2}
                        flexWrap="wrap" // Ensure the cards wrap instead of causing overflow
                        justifyContent="center"
                    >
                        {data && data.map((center) => (
                            <AdoptionCenterCard key={center.id} center={center} />
                        ))}
                    </Stack>
                </Stack>
            </main>
        </>
    );
}
