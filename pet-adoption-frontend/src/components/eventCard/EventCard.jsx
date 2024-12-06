import React, { useState, useEffect } from "react";
import { Typography, Box, Button } from "@mui/material";
import { getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import {
    Event as EventIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
} from '@mui/icons-material';
import ExpandedEventCard from "./ExpandedEventCard";
import {
    StyledCard,
    BlurredContent,
    HoverOverlay,
    EventInfo,
    DetailGrid,
    DetailItem,
    DateTimeBox,
    LocationItem,
} from "./EventCard.styles";
import { getCenterAddress } from "@/utils/user/center/getCenterAddress";
import EditIcon from '@mui/icons-material/Edit';

const EventCard = ({
    event,
    onClick,
    isManagerView = false
}) => {
    const token = useSelector((state) => state.user.token);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [location, setLocation] = useState("Loading location...");

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        try {
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
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

    const managerCardStyles = isManagerView ? {
        '& .MuiTypography-h4': {
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'primary.main',
            mb: 2
        },
        '& .detail-item': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',
                color: 'primary.main'
            }
        },
        '& .location-section': {
            mt: 1,
            p: 1,
            bgcolor: 'action.hover',
            borderRadius: 1,
        }
    } : {};

    return (
        <>
            <Box sx={{ width: "100%", height: "fit-content" }}>
                <StyledCard
                    onClick={isManagerView ? undefined : () => setIsModalOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{
                        cursor: isManagerView ? 'default' : 'pointer',
                        p: 2,
                        ...managerCardStyles
                    }}
                >
                    {isManagerView ? (
                        <EventInfo>
                            <Typography
                                variant="h4"
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    pb: 1
                                }}
                            >
                                {event.eventName || event.event_name || "Untitled Event"}
                            </Typography>

                            <Box sx={{ mt: 2 }}>
                                <Box className="detail-item">
                                    <EventIcon />
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatDate(event.eventDate || event.event_date)}
                                    </Typography>
                                </Box>

                                <Box className="detail-item" sx={{ mt: 1 }}>
                                    <ScheduleIcon />
                                    <Typography variant="body1" fontWeight={500}>
                                        {formatTime(event.eventTime || event.event_time)}
                                    </Typography>
                                </Box>

                                <Box className="location-section">
                                    <Box className="detail-item">
                                        <LocationIcon />
                                        <Typography variant="body1" fontWeight={500}>
                                            {location}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    mt: 2,
                                    mb: 2,
                                    lineHeight: 1.6,
                                }}
                            >
                                {event.eventDescription || event.event_description || "No description available"}
                            </Typography>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<EditIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClick(event);
                                }}
                                sx={{
                                    mt: 'auto',
                                    py: 1,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Edit Event Details
                            </Button>
                        </EventInfo>
                    ) : (
                        <>
                            <BlurredContent isHovered={isHovered}>
                                <EventInfo>
                                    {getAuthorityFromToken(token) === "Owner" && (
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: "text.secondary",
                                                mb: 1
                                            }}
                                        >
                                            {event.centerName || event.center_name || "Unknown Center"}
                                        </Typography>
                                    )}

                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 700,
                                            mb: 2,
                                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                        }}
                                    >
                                        {event.eventName || event.event_name || "Untitled Event"}
                                    </Typography>

                                    <DetailGrid>
                                        <DateTimeBox>
                                            <DetailItem>
                                                <EventIcon />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatDate(event.eventDate || event.event_date)}
                                                </Typography>
                                            </DetailItem>

                                            <DetailItem>
                                                <ScheduleIcon />
                                                <Typography variant="body2" fontWeight={500}>
                                                    {formatTime(event.eventTime || event.event_time)}
                                                </Typography>
                                            </DetailItem>
                                        </DateTimeBox>

                                        <LocationItem>
                                            <LocationIcon />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                    Location
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {location}
                                                </Typography>
                                            </Box>
                                        </LocationItem>
                                    </DetailGrid>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: "text.secondary",
                                            lineHeight: 1.6,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 4,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            mb: 2
                                        }}
                                    >
                                        {event.eventDescription || event.event_description || "No description available"}
                                    </Typography>
                                </EventInfo>
                            </BlurredContent>

                            <HoverOverlay className={isHovered ? "hovered" : ""}>
                                <Box sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        Click to view details
                                    </Typography>
                                </Box>
                            </HoverOverlay>
                        </>
                    )}
                </StyledCard>
            </Box>

            {!isManagerView && isModalOpen && (
                <ExpandedEventCard
                    event={event}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default EventCard;