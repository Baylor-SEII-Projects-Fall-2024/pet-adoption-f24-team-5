import React, { useState } from 'react';
import { Card, CardContent, Typography, Modal, Box, Tooltip } from '@mui/material';

const AdoptionCenterCard = ({ center }) => {
    const [open, setOpen] = useState(false);
    const [tooltipPhone, setTooltipPhone] = useState('Click to copy phone number');
    const [tooltipEmail, setTooltipEmail] = useState('Click to copy email');

    const handleClick = () => {
        setOpen(true); // Open the modal when the card is clicked
    };

    const handleClose = () => {
        setOpen(false); // Close the modal
    };

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'phone') {
                setTooltipPhone('Copied!');
                setTimeout(() => setTooltipPhone('Click to copy phone number'), 1500);
            } else {
                setTooltipEmail('Copied!');
                setTimeout(() => setTooltipEmail('Click to copy email'), 1500);
            }
        });
    };

    return (
        <>
            {/* Smaller Card */}
            <Card
                onClick={handleClick}
                sx={{
                    width: '100%',
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    transition: '0.3s',
                    boxSizing: 'border-box',
                    '&:hover': {
                        boxShadow: 8,
                        transform: 'scale(1.05)',
                    },
                    cursor: 'pointer',
                }}
                elevation={4}
            >
                <CardContent>
                    <Typography variant="h5" align="center">
                        {center.centerName}
                    </Typography>
                    <Typography variant="h6" align="center">
                        City: {center.centerCity}, State: {center.centerState}, ZipCode: {center.centerZip}
                    </Typography>
                    <Typography variant="h5" align="center">
                        Show More Information
                    </Typography>
                </CardContent>
            </Card>

            {/* Modal for the larger card */}
            <Modal
                open={open}
                onClose={handleClose}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <Box
                    sx={{
                        width: '80%',
                        maxWidth: 600,
                        backgroundColor: '#fff',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 24,
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        {center.centerName}
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                        City: {center.centerCity}, State: {center.centerState}, ZipCode: {center.centerZip}
                    </Typography>
                    <Typography variant="body1" align="center">
                        Address: {center.centerAddress}
                    </Typography>

                    {/* Highlighted and underlined phone number and email with tooltip */}
                    <Tooltip title={tooltipPhone}>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', mt: 2 }}
                            onClick={() => copyToClipboard(center.phoneNumber, 'phone')}
                        >
                            Phone: {center.phoneNumber}
                        </Typography>
                    </Tooltip>

                    <Tooltip title={tooltipEmail}>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline', mt: 1 }}
                            onClick={() => copyToClipboard(center.emailAddress, 'email')}
                        >
                            Email: {center.emailAddress}
                        </Typography>
                    </Tooltip>
                </Box>
            </Modal>
        </>
    );
};

export default AdoptionCenterCard;