import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Button,
    Collapse,
    CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import MapIcon from '@mui/icons-material/Map';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useNavigate } from 'react-router-dom';
import ExpandedEventCard from '../eventCard/ExpandedEventCard';
import { getEvents } from '@/utils/event/getEvents';
import { useSelector } from 'react-redux';

const AdoptionCenterCard = ({ center, distance, onClick, expanded, onExpand }) => {
    const navigate = useNavigate();
    const [copyTooltip, setCopyTooltip] = useState('Click to copy address');
    const [showCopyIcon, setShowCopyIcon] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.user.token);

    // Fetch events immediately to get the count
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const allEvents = await getEvents(token) || [];
                const centerEvents = allEvents.filter(event => event.center_id === center.id);
                setEvents(centerEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            }
        };

        fetchEvents();
    }, [token, center.id]);

    // Fetch full event details when expanded
    useEffect(() => {
        const fetchEventDetails = async () => {
            if (!expanded) return;
            setLoading(true);
            try {
                const allEvents = await getEvents(token) || [];
                const centerEvents = allEvents.filter(event => event.center_id === center.id);
                setEvents(centerEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        if (expanded) {
            fetchEventDetails();
        }
    }, [expanded, token, center.id]);

    const handleViewPets = (e) => {
        e.stopPropagation();
        navigate(`/AvailablePets?centerId=${center.id}`);
    };

    const handleCardClick = () => {
        onExpand?.();
    };

    const handleEventClick = (e, event) => {
        e.stopPropagation();
        setSelectedEvent({
            ...event,
            center_id: center.id,
            centerName: center.centerName
        });
    };

    const handleCloseEvent = () => {
        setSelectedEvent(null);
    };

    const handleCopyAddress = async (e) => {
        e.stopPropagation();
        const fullAddress = `${center.centerAddress}, ${center.centerCity}, ${center.centerState} ${center.centerZip}`;
        try {
            await navigator.clipboard.writeText(fullAddress);
            setCopyTooltip('Address copied!');
            setTimeout(() => setCopyTooltip('Click to copy address'), 2000);
        } catch (err) {
            console.error('Failed to copy address:', err);
            setCopyTooltip('Failed to copy');
            setTimeout(() => setCopyTooltip('Click to copy address'), 2000);
        }
    };

    const handleMapClick = (e) => {
        e.stopPropagation();
        const fullAddress = `${center.centerAddress}, ${center.centerCity}, ${center.centerState} ${center.centerZip}`;
        onClick?.(fullAddress);
    };

    const iconStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        height: 24  // Standard icon button height
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        try {
            // Parse DD/MM/YYYY format
            const [day, month, year] = dateString.split('/');
            const date = new Date(year, month - 1, day); // month is 0-based in JS Date
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            return date.toLocaleDateString(undefined, options);
        } catch (error) {
            console.error("Date formatting error:", error, dateString);
            return "Invalid date";
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return "Time not available";
        try {
            return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error("Time formatting error:", error);
            return "Invalid time";
        }
    };

    return (
        <>
            <Card
                elevation={2}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: (theme) => theme.shadows[8],
                    }
                }}
            >
                <CardContent sx={{ pb: '16px !important', flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 'medium',
                                color: 'primary.main',
                                pr: 1
                            }}
                        >
                            {center.centerName}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View on map">
                                <IconButton
                                    size="small"
                                    onClick={handleMapClick}
                                    sx={{
                                        bgcolor: 'action.selected',
                                        '&:hover': { bgcolor: 'action.focus' }
                                    }}
                                >
                                    <MapIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Stack spacing={2}>
                        <Tooltip
                            title={copyTooltip}
                            placement="bottom"
                            enterDelay={200}
                            leaveDelay={0}
                        >
                            <Box
                                sx={{
                                    ...iconStyles,
                                    p: 1,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    '&:hover': {
                                        '& .copy-icon': {
                                            opacity: 1,
                                        },
                                        '& .address-text': {
                                            color: 'text.primary',
                                        }
                                    }
                                }}
                                onClick={handleCopyAddress}
                                onMouseEnter={() => setShowCopyIcon(true)}
                                onMouseLeave={() => setShowCopyIcon(false)}
                            >
                                <LocationOnIcon color="action" fontSize="small" />
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className="address-text"
                                    sx={{
                                        lineHeight: 1.4,
                                        transition: 'color 0.2s ease'
                                    }}
                                >
                                    {center.centerAddress},<br />
                                    {center.centerCity}, {center.centerState} {center.centerZip}
                                </Typography>
                                <ContentCopyIcon
                                    className="copy-icon"
                                    fontSize="small"
                                    sx={{
                                        position: 'absolute',
                                        right: 0,
                                        opacity: showCopyIcon ? 1 : 0,
                                        transition: 'opacity 0.2s ease',
                                        color: 'action.active'
                                    }}
                                />
                            </Box>
                        </Tooltip>

                        <Box sx={{ ...iconStyles, p: 1 }}>
                            <PetsIcon color="primary" fontSize="small" />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'medium'
                                }}
                            >
                                {center.numberOfPets} pets available
                            </Typography>
                        </Box>

                        <Box
                            onClick={handleCardClick}
                            sx={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'action.hover',
                                p: 1,
                                borderRadius: 1,
                                transition: 'all 0.2s ease',
                                height: 40,  // Fixed height for consistency
                                '&:hover': {
                                    bgcolor: 'action.selected'
                                }
                            }}
                        >
                            <Box sx={iconStyles}>
                                <EventIcon color="primary" fontSize="small" />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 'medium',
                                        flex: 1
                                    }}
                                >
                                    {events.length} upcoming events
                                </Typography>
                            </Box>
                            {expanded ? (
                                <ExpandLessIcon fontSize="small" color="action" />
                            ) : (
                                <ExpandMoreIcon fontSize="small" color="action" />
                            )}
                        </Box>

                        <Box sx={{ minHeight: expanded ? 'auto' : 0, transition: 'min-height 300ms ease' }}>
                            <Collapse
                                in={expanded}
                                timeout={300}
                                sx={{
                                    '& .MuiCollapse-wrapper': {
                                        transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1) !important'
                                    }
                                }}
                            >
                                <Box sx={{ mt: 1, mb: 1 }}>
                                    {loading ? (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    ) : events.length > 0 ? (
                                        <Stack spacing={1}>
                                            {events.map((event) => (
                                                <Box
                                                    key={event.id}
                                                    onClick={(e) => handleEventClick(e, event)}
                                                    sx={{
                                                        p: 1.5,
                                                        bgcolor: 'background.default',
                                                        borderRadius: 1,
                                                        border: 1,
                                                        borderColor: 'divider',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            bgcolor: 'action.hover'
                                                        }
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color="primary.main">
                                                        {event.event_name || event.eventName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formatDate(event.event_date || event.eventDate)} at {formatTime(event.event_time || event.eventTime)}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                                            No upcoming events scheduled
                                        </Typography>
                                    )}
                                </Box>
                            </Collapse>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip
                                label={`${parseFloat(distance).toFixed(1)} miles away`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    borderRadius: 1.5,
                                    '& .MuiChip-label': {
                                        px: 1
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={handleViewPets}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    minWidth: '120px'
                                }}
                            >
                                View Pets
                            </Button>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
            {selectedEvent && (
                <ExpandedEventCard
                    event={selectedEvent}
                    onClose={handleCloseEvent}
                />
            )}
        </>
    );
};

export default AdoptionCenterCard;