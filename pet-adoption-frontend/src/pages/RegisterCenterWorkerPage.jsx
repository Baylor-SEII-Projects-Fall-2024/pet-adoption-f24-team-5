import React, { useState } from 'react';
import {
    Button, TextField, Stack, Typography, Box, InputAdornment, CircularProgress
} from '@mui/material';
import { Email, Lock, Phone, CheckCircle } from '@mui/icons-material'; // Import Check Icon
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { handleRegisterCenterWorker } from "@/utils/register/registerCenterWorker";

const RegisterCenterWorker = () => {
    const [registrationData, setRegistrationData] = useState({
        userType: "CenterWorker",
    });
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = useSelector((state) => state.user.token);

    // Phone number formatting function
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, ''); // Remove non-digit characters
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); // Match groups of numbers

        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join('-'); // Join with '-' separator
        }
        return value;
    };

    const handlePhoneNumberChange = (e) => {
        const formattedNumber = formatPhoneNumber(e.target.value);
        setRegistrationData({ ...registrationData, phoneNumber: formattedNumber });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await handleRegisterCenterWorker(registrationData, token);
            setIsRegistered(true);
        } catch (err) {
            console.error('An error occurred during registration:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #FFFFFF 30%, #E7E9EC 90%)',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        width: '400px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                        padding: 4,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Register Center Worker
                    </Typography>

                    {!isRegistered ? (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="First Name"
                                    type="text"
                                    value={registrationData.firstName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Last Name"
                                    type="text"
                                    value={registrationData.lastName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={registrationData.emailAddress}
                                    onChange={(e) => setRegistrationData({ ...registrationData, emailAddress: e.target.value })}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    value={registrationData.password}
                                    onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <TextField
                                    label="Age"
                                    type="number"
                                    value={registrationData.age}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 99)) {
                                            setRegistrationData({ ...registrationData, age: value });
                                        }

                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                            e.preventDefault();
                                        }
                                    }}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={registrationData.phoneNumber}
                                    onChange={(e) => handlePhoneNumberChange(e)}
                                    required
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Phone />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    disabled={isSubmitting}
                                    sx={{
                                        background: 'linear-gradient(90deg, #43cea2, #185a9d)',
                                        color: 'white',
                                        borderRadius: '50px',
                                        padding: '10px 0',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #43cea2, #43cea2)',
                                        },
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} sx={{ color: 'white' }} />
                                    ) : (
                                        'Register'
                                    )}
                                </Button>
                            </Stack>
                        </form>
                    ) : (
                        <Stack spacing={2} alignItems="center">
                            <CheckCircle sx={{ fontSize: 60, color: '#43cea2' }} />
                            <Typography variant="h5" color="textSecondary">
                                Account Created!
                            </Typography>
                            <Link to="/ManageAccounts" style={{ color: '#43cea2', textDecoration: 'none' }}>
                                Back to Account Manager
                            </Link>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterCenterWorker;
