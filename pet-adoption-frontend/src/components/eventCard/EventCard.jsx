import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
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

const EventCard = ({ event }) => {
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

    return (
        <>
            <Box sx={{ width: "330px", height: "400px" }}>
                <StyledCard
                    onClick={() => setIsModalOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    sx={{ cursor: 'pointer' }}
                >
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
                </StyledCard>
            </Box>

            {isModalOpen && (
                <ExpandedEventCard
                    event={event}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
};

export default EventCard;