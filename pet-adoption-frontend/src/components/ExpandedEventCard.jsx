import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ExpandedEventCard = ({ event, onClose }) => {
    return (
        <Modal open={!!event} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 4,
                    backgroundColor: 'white',
                    borderRadius: 2
                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    {event.event_name}
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    {event.event_description}
                </Typography>
                <Typography variant="body2" align="center">
                    Date: {event.event_date}
                </Typography>
                <Typography variant="body2" align="center">
                    Time: {event.event_time}
                </Typography>
                <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box>
        </Modal>
    );
};

export default ExpandedEventCard;
