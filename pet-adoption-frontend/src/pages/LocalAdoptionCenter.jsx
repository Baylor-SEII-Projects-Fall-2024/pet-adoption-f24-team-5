import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import AdoptionCenterCard from '../components/AdoptionCenterCard';
import axios from 'axios';
import { getSubjectFromToken } from '../utils/tokenUtils';
import { API_URL, FRONTEND_URL } from "@/constants";
import TitleBar from "@/components/TitleBar";
import { useSelector } from 'react-redux';

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
};

export default function AdoptionCenterPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState(null);
    const [ownerLat, setOwnerLat] = useState(null); // Owner's latitude
    const [ownerLng, setOwnerLng] = useState(null); // Owner's longitude
    const token = useSelector((state) => state.user.token);

    console.log("owner lat:" + ownerLat);
    console.log("ownerLng:" + ownerLng);

    useEffect(() => {
        // Extract user email (subject) from the token
        if (token) {
            const subject = getSubjectFromToken(token); // Use the provided function
            if (subject) {
                setUserEmail(subject); // Store the user email (subject)
            }
        }

        // Fetch the owner user information
        const fetchUserInfo = async () => {
            try {
                const url = `${API_URL}/api/users/getUser?emailAddress=${userEmail}`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const user = response.data;
                if (user.userType === 'Owner') {
                    // Use the owner's latitude and longitude
                    setOwnerLat(user.latitude);
                    setOwnerLng(user.longitude);
                }
            } catch (error) {
                console.error('Error fetching owner data:', error);
            }
        };

        const fetchAdoptionCenters = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/users/adoptioncenters`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass token in the header
                        'Content-Type': 'application/json',
                    },
                });
                let centers = response.data;

                // Sort the centers by distance from the owner (or default to Waco if not found)
                if (ownerLat && ownerLng) {
                    centers = centers.sort((a, b) => {
                        const distanceA = calculateDistance(ownerLat, ownerLng, a.latitude, a.longitude);
                        const distanceB = calculateDistance(ownerLat, ownerLng, b.latitude, b.longitude);
                        return distanceA - distanceB;
                    });
                }

                setData(centers); // Store sorted data in state
            } catch (error) {
                console.error('Error fetching adoption centers:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userEmail) {
            fetchUserInfo(); // Fetch user info first
            fetchAdoptionCenters(); // Then fetch adoption centers
        }
    }, [token, userEmail, ownerLat, ownerLng]);

    if (loading) {
        return <Typography>Loading adoption centers...</Typography>;
    }

    return (
        <>
            <TitleBar />
            <Head>
                <title>Local Adoption Centers</title>
            </Head>

            <main>
                <Stack
                    sx={{
                        paddingTop: 4,
                        alignItems: 'center',
                        overflow: 'hidden',
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
                        flexWrap="wrap"
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
