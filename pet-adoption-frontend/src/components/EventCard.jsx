import {Card, CardContent, Typography} from "@mui/material";
import {getAuthorityFromToken} from "@/utils/tokenUtils";
import React from "react";
import {useSelector} from "react-redux";

const EventCard = ({ event, onClick }) => {
    //const [day, month, year] = event.event_date.split('/');{`${day}/${month}/${year}`}
    const token = useSelector((state) => state.user.token);

    return (
        <Card
            onClick={onClick}
            sx={{
                flexBasis: '45%',
                flexGrow: 1,
                maxWidth: '600px',
                backgroundColor: 'white',
                transition: 'border 0.3s',
                '&:hover': { border: '2px solid blue' },
            }}
            elevation={4}
            key={event.event_id}
        >
            <CardContent>
                {getAuthorityFromToken(token) === "Owner" && (
                    <Typography variant="h4" align="center">
                        {event.center_name || "Unknown Center"}
                    </Typography>
                )}
                <Typography variant="h5" align="center">
                    {event.event_name}
                </Typography>
                <Typography variant="body1" align="center">
                    {event.event_description}
                </Typography>
                <Typography variant="body2" align="center">
                    {event.event_date}
                </Typography>
                <Typography variant="body2" align="center" color="textSecondary">
                    {event.event_time}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EventCard;