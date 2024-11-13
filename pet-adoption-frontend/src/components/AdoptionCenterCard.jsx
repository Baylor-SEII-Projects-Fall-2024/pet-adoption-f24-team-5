import React, { useState } from 'react';
import { Card, CardContent, Typography, Modal, Box, Tooltip, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from '@/constants';
import { getSubjectFromToken } from '@/utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

const AdoptionCenterCard = ({ center }) => {
    const [open, setOpen] = useState(false);
    const [tooltipPhone, setTooltipPhone] = useState('Click to copy phone number');
    const [tooltipEmail, setTooltipEmail] = useState('Click to copy email');

    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate();

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

    // Function to fetch user data
    const fetchUser = async (token) => {
        try {
            let email = '';

            // Extract user email (subject) from the token
            if (token) {
                const subject = getSubjectFromToken(token);
                if (subject) {
                    email = subject;
                } else {
                    throw new Error('Invalid token: Subject not found.');
                }
            } else {
                throw new Error('Token is required to fetch user information.');
            }

            const url = `${API_URL}/api/users/getUser?emailAddress=${email}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            // Return the user data
            return response.data;
        } catch (error) {
            console.error('Failed to fetch user', error);
            throw error;
        }
    };

    // Function to handle contacting the adoption center
    const handleContactCenter = async () => {
        try {
            // Fetch user data to get userId
            const userData = await fetchUser(token);
            const userId = userData.id;

            const centerID = center.id; // Use center.centerId if that's the correct property

            const url = `${API_URL}/api/conversation/startConversation`;

            const response = await axios.post(
                url,
                null,
                {
                    params: {
                        petOwnerID: userId,
                        centerID: centerID,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Conversation started:', response.data);

            // Navigate to the Messages page
            navigate('/Messages');
        } catch (error) {
            console.error('Failed to start conversation', error);
            // Optionally, display an error message to the user
        }
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

                    {/* Contact Adoption Center Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleContactCenter}
                        sx={{ mt: 2 }}
                    >
                        Contact Adoption Center
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default AdoptionCenterCard;