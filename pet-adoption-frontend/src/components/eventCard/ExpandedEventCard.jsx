import React, { useState, useEffect } from 'react';
import { Modal, Typography, Box, Fade, IconButton, Tooltip } from '@mui/material';
import {
    Event as EventIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
    Close as CloseIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { getCenterAddress } from '@/utils/user/center/getCenterAddress';

const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '1000px',
    height: '85vh',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(4, 5),
}));

const DetailGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: theme.spacing(3),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
        gap: theme.spacing(2),
    },
}));

const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    borderRadius: '20px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(139,115,85,0.1)',
    },
    '& svg': {
        color: theme.palette.primary.main,
        fontSize: '2rem',
    },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    padding: theme.spacing(4, 5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
}));

const ExpandedEventCard = ({ event, onClose }) => {
    const [location, setLocation] = useState("Loading location...");
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const centerInfo = await getCenterAddress(token, event.center_id);
                if (!centerInfo) {
                    setLocation("Location not available");
                    return;
                }
                const parts = [];
                if (centerInfo.centerAddress) parts.push(centerInfo.centerAddress);
                if (centerInfo.centerCity) parts.push(centerInfo.centerCity);
                if (centerInfo.centerState) parts.push(centerInfo.centerState);
                if (centerInfo.centerZip) parts.push(centerInfo.centerZip);
                setLocation(parts.join(', ') || "Location not available");
            } catch (error) {
                console.error("Error fetching location:", error);
                setLocation("Location not available");
            }
        };

        fetchLocation();
    }, [token, event.center_id]);

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        try {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        } catch (error) {
            console.error("Date formatting error:", error);
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
        <Modal
            open={true}
            onClose={onClose}
            closeAfterTransition
        >
            <Fade in={true}>
                <ModalContainer>
                    <HeaderSection>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Box>
                                <Typography
                                    variant="h3"
                                    fontWeight={800}
                                    sx={{
                                        mb: 1,
                                        color: 'text.primary',
                                    }}
                                >
                                    {event.eventName || event.event_name || "Untitled Event"}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 500,
                                        color: 'text.secondary'
                                    }}
                                >
                                    {event.centerName || event.center_name || "Unknown Center"}
                                </Typography>
                            </Box>
                            <Tooltip title="Close">
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 2px 8px rgba(139,115,85,0.1)',
                                        borderRadius: '12px',
                                        '&:hover': {
                                            bgcolor: 'background.paper',
                                            transform: 'scale(1.1)',
                                        },
                                        transition: 'transform 0.2s ease',
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </HeaderSection>

                    <ContentWrapper>
                        <DetailGrid>
                            <DetailItem>
                                <EventIcon />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Date
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(event.eventDate || event.event_date)}
                                    </Typography>
                                </Box>
                            </DetailItem>

                            <DetailItem>
                                <ScheduleIcon />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Time
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatTime(event.eventTime || event.event_time)}
                                    </Typography>
                                </Box>
                            </DetailItem>

                            <DetailItem>
                                <LocationIcon />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Location
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {location}
                                    </Typography>
                                </Box>
                            </DetailItem>
                        </DetailGrid>

                        {event.capacity && (
                            <DetailItem sx={{ mb: 4, maxWidth: '300px' }}>
                                <PersonIcon />
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Capacity
                                    </Typography>
                                    <Typography variant="body1" fontWeight={500}>
                                        {event.capacity} attendees
                                    </Typography>
                                </Box>
                            </DetailItem>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                sx={{
                                    mb: 3,
                                    color: 'text.primary',
                                }}
                            >
                                About This Event
                            </Typography>
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    lineHeight: 1.8,
                                    letterSpacing: 0.3,
                                    fontSize: '1.1rem',
                                }}
                            >
                                {event.eventDescription || event.event_description || "No description available"}
                            </Typography>
                        </Box>
                    </ContentWrapper>
                </ModalContainer>
            </Fade>
        </Modal>
    );
};

export default ExpandedEventCard;
