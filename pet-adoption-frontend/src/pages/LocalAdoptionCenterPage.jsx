import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Card,
    CardContent,
    Stack,
    Typography,
    Container,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import AdoptionCenterCard from '../components/adoptionCenterCard/AdoptionCenterCard';
import { getSubjectFromToken } from '../utils/redux/tokenUtils';
import { useSelector } from 'react-redux';
import { getUser } from "@/utils/user/getUser";
import { getCenters } from "@/utils/user/center/getCenters";

// Updated calculateDistance function to return miles
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3959; // Earth's radius in miles (was 6371 for kilometers)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function AdoptionCenterPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [ownerLat, setOwnerLat] = useState(null);
    const [ownerLng, setOwnerLng] = useState(null);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (token) {
                    const subject = getSubjectFromToken(token);
                    if (subject) {
                        setUserEmail(subject);
                        const user = await getUser(token, subject);

                        if (user.userType === 'Owner') {
                            setOwnerLat(user.latitude);
                            setOwnerLng(user.longitude);
                        }

                        let centers = await getCenters(token);

                        if (user.userType === 'Owner' && user.latitude && user.longitude) {
                            centers = centers.sort((a, b) => {
                                const distanceA = calculateDistance(user.latitude, user.longitude, a.latitude, a.longitude);
                                const distanceB = calculateDistance(user.latitude, user.longitude, b.latitude, b.longitude);
                                return distanceA - distanceB;
                            });
                        }

                        setData(centers);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load adoption centers. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    return (
        <>
            <Head>
                <title>Local Adoption Centers</title>
            </Head>

            <Container maxWidth="lg">
                <Box sx={{ py: 4 }}>
                    {userEmail && (
                        <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            <CardContent>
                                <Typography variant="h5" align="center" gutterBottom>
                                    Welcome, {userEmail}!
                                </Typography>
                                {ownerLat && ownerLng && (
                                    <Typography variant="body2" align="center">
                                        Showing adoption centers sorted by distance from your location
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
                    ) : (
                        <Stack
                            direction="row"
                            gap={3}
                            flexWrap="wrap"
                            justifyContent="center"
                            sx={{
                                '& > *': {
                                    flexBasis: {
                                        xs: '100%',
                                        sm: 'calc(50% - 16px)',
                                        md: 'calc(33.333% - 16px)',
                                    },
                                    minWidth: 280,
                                }
                            }}
                        >
                            {data?.map((center) => (
                                <AdoptionCenterCard
                                    key={center.id}
                                    center={center}
                                    distance={
                                        ownerLat && ownerLng
                                            ? calculateDistance(ownerLat, ownerLng, center.latitude, center.longitude)
                                            : null
                                    }
                                />
                            ))}
                        </Stack>
                    )}

                    {data?.length === 0 && (
                        <Alert severity="info" sx={{ mt: 4 }}>
                            No adoption centers found in your area.
                        </Alert>
                    )}
                </Box>
            </Container>
        </>
    );
}