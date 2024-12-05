import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, IconButton, Stack } from "@mui/material";
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import PetCard from "@/components/petCard/PetCard";
import { generateNewOptions } from "@/utils/recommendationEngine/generateNewOptions";
import { getEvents } from "@/utils/event/getEvents";
import { getCenterName } from "@/utils/user/center/getCenterName";
import EventCard from "@/components/eventCard/EventCard";
import HamburgerMenu from "@/components/HamburgerMenu";
import SavedPetsModal from "@/components/SavedPetsModal";

const FindAPetPage = () => {
    const [currentPets, setCurrentPets] = useState([]);
    const [preloadedPets, setPreloadedPets] = useState([]);
    const [events, setEvents] = useState([]);
    const [isEventsCollapsed, setIsEventsCollapsed] = useState(false);
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const userType = getAuthorityFromToken(token);
    const [loading, setLoading] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [hamburgerAnchorEl, setHamburgerAnchorEl] = useState(null);
    const [savedPetsModalOpen, setSavedPetsModalOpen] = useState(false);

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

    useEffect(() => {
        handleSearch();
        setShowWelcomeModal(true);
    }, [token]);

    const handleSearch = async () => {
        if (preloadedPets.length > 0) {
            setCurrentPets(preloadedPets);
        }
        else {
            const response = await generateNewOptions(token);
            setCurrentPets(response);
        }

        // Swap current pets with preloaded pets
        const preloadNextOptions = async () => {
            const response = await generateNewOptions(token);
            setPreloadedPets(response);
        };

        // Preload the next set of options in the background
        preloadNextOptions();
    }

    const handleOpenHamburgerMenu = (event) => {
        setHamburgerAnchorEl(event.currentTarget);
    }

    const handleCloseHamburgerMenu = () => {
        setHamburgerAnchorEl(null);
    }

    const handleSelectSpecies = (species) => {
        console.log(`Selected species: ${species}`);
        // Implement logic to filter or search pets by the selected species
        handleCloseHamburgerMenu();
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
                <Box sx={{ flex: 1, p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Grid container spacing={3} justifyContent="center">
                        {loading ? (
                            <Typography variant="h6" textAlign="center" sx={{ width: '100%', mt: 4 }}>
                                Finding perfect matches for you...
                            </Typography>
                        ) : (
                            Array.isArray(currentPets) && currentPets.map((pet) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={isEventsCollapsed ? 6 : 6}
                                    md={isEventsCollapsed ? 4 : 4}
                                    key={pet.id}
                                >
                                    <PetCard pet={pet} onLike={handleSearch} />
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Box>

                {/* Footer Actions */}
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
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
                        size="large"
                        sx={{
                            bgcolor: '#4b6cb7',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#3b5998',
                            },
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px',
                            padding: '12px 24px',
                        }}
                    >
                        Discover New Pets
                    </Button>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setSavedPetsModalOpen(true)}
                    >
                        View Saved Pets
                    </Button>

                    <Button
                        sx={{
                            bgcolor: '#4b6cb7',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#3b5998',
                            },
                            marginLeft: 'auto',
                        }}
                        onClick={handleOpenHamburgerMenu}
                        variant="contained"
                        size="large"
                    >
                        Not Seeing What You Want?
                    </Button>
                </Box>
            </Box>

            <HamburgerMenu
                anchorEl={hamburgerAnchorEl}
                open={Boolean(hamburgerAnchorEl)}
                onClose={handleCloseHamburgerMenu}
                onSelectSpecies={handleSelectSpecies}
            />

            <SavedPetsModal
                open={savedPetsModalOpen}
                onClose={() => setSavedPetsModalOpen(false)}
            />
        </Box>
    )
}

export default FindAPetPage;