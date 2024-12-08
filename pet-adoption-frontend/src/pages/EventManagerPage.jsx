import React, { useEffect, useState } from 'react';
import {
    Typography,
    Box,
    Button,
    Stack,
    CircularProgress,
    Container,
    Paper,
    Grid,
    TextField,
    InputAdornment,
    Pagination
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import EventCard from "@/components/eventCard/EventCard";
import EventFormComponent from "@/components/eventForm/EventFormComponent";
import { getEvents } from "@/utils/event/getEvents";
import { getCenterName } from "@/utils/user/center/getCenterName";
import { getCenterEvents } from "@/utils/user/center/getCenterEvents";
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/redux/tokenUtils";

const EventManager = () => {
    const [formType, setFormType] = useState('');
    const [formEvent, setFormEvent] = useState({});
    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [events, setEvents] = useState([]);
    const token = useSelector((state) => state.user.token);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 12;

    const handleCardClick = (event) => {
        if (getAuthorityFromToken(token) !== "Owner") {
            setFormEvent(event);
            setFormType("update");
            setCreateNewEvent(true);
        }
    };

    const handleCreateNewEvent = () => {
        setCreateNewEvent(!createNewEvent);
        setFormType("save");
        setFormEvent({});
    };

    const handleFetchEvents = async () => {
        setLoading(true);
        try {
            let response;
            if (getAuthorityFromToken(token) === "Owner") {
                response = await getEvents(token);
            } else {
                response = await getCenterEvents(token, getSubjectFromToken(token));
            }

            const eventsWithCenterNames = await Promise.all(
                response.map(async (event) => {
                    const centerName = await getCenterName(token, event.center_id);
                    return { ...event, center_name: centerName };
                })
            );

            setEvents(eventsWithCenterNames);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!createNewEvent) {
            handleFetchEvents();
            setFormType('');
        }
    }, [createNewEvent]);

    const filteredEvents = events.filter(event => {
        const searchTerms = searchText
            .toLowerCase()
            .split(',')
            .map(term => term.trim())
            .filter(term => term !== '');

        return searchTerms.length === 0 || searchTerms.every(term => {
            const matchesNameOrDesc =
                event.event_name.toLowerCase().includes(term) ||
                event.event_description.toLowerCase().includes(term);

            const eventDate = new Date(event.event_date.split('/').reverse().join('-'));
            const formattedDate = eventDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).toLowerCase();
            const matchesDate = formattedDate.includes(term);

            const [hours, minutes] = event.event_time.split(':');
            const eventTime = new Date();
            eventTime.setHours(hours);
            eventTime.setMinutes(minutes);
            const formattedTime = eventTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).toLowerCase();
            const matchesTime = formattedTime.includes(term);

            return matchesNameOrDesc || matchesDate || matchesTime;
        });
    });

    return (
        <Container maxWidth="xl" sx={{ height: '92vh', py: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {createNewEvent ? (
                <EventFormComponent type={formType} handleCreateNewEvent={handleCreateNewEvent} event={formEvent} />
            ) : (
                <>
                    <Paper elevation={1} sx={{ p: 1, mb: 0.5, borderRadius: '8px', backgroundColor: 'background.paper' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Button
                                        onClick={handleCreateNewEvent}
                                        color='primary'
                                        variant='contained'
                                        sx={{ height: '40px' }}
                                    >
                                        Post New Event
                                    </Button>

                                    <TextField
                                        size="small"
                                        placeholder="Search by event name, date (December 25), time (2:00 PM), or description"
                                        variant="outlined"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                        {filteredEvents.length} events
                                                    </Typography>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ flex: 1 }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
                                    <Grid
                                        container
                                        sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: 'repeat(1, 1fr)',
                                                sm: 'repeat(2, 1fr)',
                                                md: 'repeat(3, 1fr)',
                                                lg: 'repeat(4, 1fr)'
                                            },
                                            gap: 1.5,
                                            mb: 1
                                        }}
                                    >
                                        {filteredEvents
                                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                            .map((event) => (
                                                <Box key={event.event_id} sx={{ height: 'fit-content' }}>
                                                    <EventCard
                                                        event={event}
                                                        onClick={() => handleCardClick(event)}
                                                        isManagerView={true}
                                                    />
                                                </Box>
                                            ))}
                                    </Grid>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 1,
                                    borderTop: 1,
                                    borderColor: 'divider',
                                    backgroundColor: 'background.paper'
                                }}>
                                    <Pagination
                                        count={Math.ceil(filteredEvents.length / itemsPerPage)}
                                        page={page}
                                        onChange={(e, value) => setPage(value)}
                                        color="primary"
                                        size="small"
                                        showFirstButton
                                        showLastButton
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </>
            )}
        </Container>
    );
};

export default EventManager;