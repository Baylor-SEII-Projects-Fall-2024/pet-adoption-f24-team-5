import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, Modal, Container, Collapse, IconButton, Stack } from "@mui/material";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import PetCard from "@/components/petCard/PetCard";
import { generateNewOptions } from "@/utils/recommendationEngine/generateNewOptions";
import { getSavedPets } from "@/utils/user/owner/GetSavedPets";
import { getEvents } from "@/utils/event/getEvents";
import { getCenterName } from "@/utils/user/center/getCenterName";
import EventCard from "@/components/eventCard/EventCard";

const FindAPetPage = () => {
    const [pets, setPets] = useState([]);
    const [events, setEvents] = useState([]);
    const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const userType = getAuthorityFromToken(token);
    const [showSavedPets, setShowSavedPets] = useState(false);
    const [savedPets, setSavedPets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const eventsResponse = await getEvents(token) || [];

                const eventsWithCenterNames = await Promise.all(
                    eventsResponse.map(async (event) => {
                        const centerName = await getCenterName(token, event.center_id);
                        return { ...event, center_name: centerName };
                    })
                );

                setEvents(eventsWithCenterNames);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, [token, userType, email]);

    const handleSearch = async () => {
        setLoading(true);
        const response = await generateNewOptions(token);
        setPets(response);
        setLoading(false);
    }

    useEffect(() => {
        handleSearch();
        setShowWelcomeModal(true);
    }, []);

    const handleOpenSavedPets = async () => {
        try {
            setLoading(true);
            const response = await getSavedPets(token, email);
            setSavedPets(response);
            setShowSavedPets(true);
        } catch (error) {
            console.error('Error fetching saved pets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSavedPets = () => {
        setShowSavedPets(false);
    }

    const handleCloseWelcomeModal = () => {
        setShowWelcomeModal(false);
    }

    return (
        <Box sx={{ height: '92vh', display: 'flex' }}>
            {/* Events Sidebar */}
            <Box
                sx={{
                    width: isEventsCollapsed ? '60px' : '400px',
                    borderRight: '1px solid #e0e0e0',
                    bgcolor: 'white',
                    transition: 'width 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '92vh',
                    overflowY: 'auto',
                }}
            >
                {/* Sidebar Header */}
                <Box
                    sx={{
                        p: 2,
                        borderBottom: '1px solid #e0e0e0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isEventsCollapsed ? 'center' : 'space-between',
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'white',
                        zIndex: 1,
                    }}
                >
                    {!isEventsCollapsed && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Upcoming Events
                        </Typography>
                    )}
                    <IconButton
                        onClick={() => setIsEventsCollapsed(!isEventsCollapsed)}
                        sx={{
                            transform: isEventsCollapsed ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.3s ease',
                        }}
                    >
                        {isEventsCollapsed ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                </Box>

                {/* Events List */}
                {!isEventsCollapsed && (
                    <Box sx={{ p: 2, overflowY: 'auto' }}>
                        {events.length > 0 ? (
                            <Stack spacing={2}>
                                {events.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        sx={{
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <Typography
                                variant="body1"
                                textAlign="center"
                                sx={{ color: 'text.secondary', mt: 2 }}
                            >
                                No upcoming events at this time
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>

            {/* Main Content Area */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '92vh',
                overflowY: 'auto'
            }}>
                {/* Pet Grid Section */}
                <Box sx={{ flex: 1, p: 4 }}>
                    <Grid container spacing={3}>
                        {loading ? (
                            <Typography variant="h6" textAlign="center" sx={{ width: '100%', mt: 4 }}>
                                Finding perfect matches for you...
                            </Typography>
                        ) : (
                            Array.isArray(pets) && pets.map((pet) => (
                                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                    <PetCard pet={pet} onLike={handleSearch} />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>

                {/* Footer Actions */}
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        borderTop: '1px solid #e0e0e0',
                        bgcolor: 'white',
                        position: 'sticky',
                        bottom: 0,
                    }}
                >
                    <Button
                        onClick={handleSearch}
                        variant="contained"
                        size="medium"
                        sx={{
                            bgcolor: '#4b6cb7',
                            '&:hover': {
                                bgcolor: '#3b5998',
                            },
                        }}
                    >
                        Discover Pets
                    </Button>
                    <Button
                        onClick={handleOpenSavedPets}
                        variant="outlined"
                        size="medium"
                        sx={{
                            borderColor: '#4b6cb7',
                            color: '#4b6cb7',
                            '&:hover': {
                                borderColor: '#3b5998',
                                bgcolor: 'rgba(75,108,183,0.1)',
                            },
                        }}
                    >
                        Saved Pets
                    </Button>
                </Box>
            </Box>

            {/* Saved Pets Modal */}
            <Modal
                open={showSavedPets}
                onClose={handleCloseSavedPets}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '80%',
                        height: '80vh',
                        backgroundColor: 'white',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
                            Saved Pets
                        </Typography>
                        {loading ? (
                            <Typography>Loading saved pets...</Typography>
                        ) : savedPets.length > 0 ? (
                            <Grid container spacing={2}>
                                {savedPets.map((pet) => (
                                    <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                        <PetCard pet={pet} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography textAlign="center">No saved pets found</Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseSavedPets}
                            variant="contained"
                            sx={{
                                bgcolor: '#4b6cb7',
                                '&:hover': {
                                    bgcolor: '#3b5998',
                                },
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* Welcome Modal */}
            <Modal
                open={showWelcomeModal}
                onClose={handleCloseWelcomeModal}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '80%',
                        height: '80vh',
                        backgroundColor: 'white',
                        borderRadius: 4,
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 2 }} textAlign="center">
                            Welcome to Pet Adoption!
                        </Typography>
                        <Typography variant="body1" textAlign="center">
                            Discover your perfect pet today.
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseWelcomeModal}
                            variant="contained"
                            sx={{
                                bgcolor: '#4b6cb7',
                                '&:hover': {
                                    bgcolor: '#3b5998',
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    )
}

export default FindAPetPage;