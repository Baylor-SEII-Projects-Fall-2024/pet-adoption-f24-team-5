import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import {
    Stack,
    Typography,
    Box,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    IconButton,
    Drawer
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AdoptionCenterCard from '../components/adoptionCenterCard/AdoptionCenterCard';
import { getSubjectFromToken } from '../utils/redux/tokenUtils';
import { useSelector } from 'react-redux';

import { getUser } from "@/utils/user/getUser";
import { getCenters } from "@/utils/user/center/getCenters";
import { getAllPets } from "@/utils/pet/getAllPets";
import MapComponent from '../components/MapComponent';

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
    const [error, setError] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [ownerLat, setOwnerLat] = useState(null);
    const [ownerLng, setOwnerLng] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCenterId, setExpandedCenterId] = useState(null);
    const token = useSelector((state) => state.user.token);
    const mapRef = useRef(null);

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

                        let petsForCenterCounts = await getAllPets(token);

                        centers.forEach(center => {
                            center.numberOfPets = petsForCenterCounts.filter(pet => pet.adoptionCenter.id === center.id).length;
                        });
                        console.log(centers);

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

    const handleCenterClick = (addressOrCenter) => {
        if (typeof addressOrCenter === 'string') {
            // If it's a string, treat it as an address
            mapRef.current?.zoomToAddress(addressOrCenter);
        } else {
            // If it's an object, treat it as center coordinates
            mapRef.current?.zoomToCenter(addressOrCenter);
        }
    };

    const handleExpandCenter = (centerId) => {
        setExpandedCenterId(expandedCenterId === centerId ? null : centerId);
    };

    const filteredCenters = data?.filter(center => {
        const query = searchQuery.toLowerCase();
        return (
            center.centerName?.toLowerCase().includes(query) ||
            center.centerCity?.toLowerCase().includes(query) ||
            center.centerState?.toLowerCase().includes(query) ||
            center.centerZip?.toLowerCase().includes(query)
        );
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    return (
        <Box sx={{ height: '92vh', display: 'flex', overflow: 'hidden' }}>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <CircularProgress size={60} />
                </Box>
            ) : error ? (
                <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                    <Alert severity="error" sx={{ m: 4, borderRadius: 2, '& .MuiAlert-message': { fontSize: '1.1rem' } }}>
                        {error}
                    </Alert>
                </Box>
            ) : (
                <>
                    {/* Map Section - Left Side */}
                    <Box sx={{ flex: 1.5, height: '100%', position: 'relative' }}>
                        <MapComponent ref={mapRef} centers={filteredCenters} />
                    </Box>

                    {/* Centers List - Middle */}
                    <Box
                        sx={{
                            flex: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderLeft: 1,
                            borderColor: 'divider',
                            bgcolor: 'background.default'
                        }}
                    >
                        {/* Search Bar */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                placeholder="Search by name, city, state, or zip..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchQuery && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={handleClearSearch} edge="end">
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    bgcolor: 'background.paper',
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': { borderColor: 'divider' },
                                        '&:hover fieldset': { borderColor: 'primary.main' }
                                    }
                                }}
                            />
                        </Box>

                        {/* Centers List */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                            {filteredCenters?.length === 0 ? (
                                <Alert
                                    severity="info"
                                    sx={{ borderRadius: 2, '& .MuiAlert-message': { fontSize: '1.1rem' } }}
                                >
                                    {searchQuery
                                        ? 'No adoption centers match your search.'
                                        : 'No adoption centers found in your area.'}
                                </Alert>
                            ) : (
                                <Stack spacing={2}>
                                    {filteredCenters?.map((center) => (
                                        <AdoptionCenterCard
                                            key={center.id}
                                            center={center}
                                            expanded={expandedCenterId === center.id}
                                            onExpand={() => handleExpandCenter(center.id)}
                                            distance={
                                                ownerLat && ownerLng
                                                    ? calculateDistance(ownerLat, ownerLng, center.latitude, center.longitude)
                                                    : null
                                            }
                                            onClick={handleCenterClick}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}