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
                minHeight: '92vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                py: 4
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '500px',
                    mx: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(139,115,85,0.1)',
                    p: 4
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        color: 'text.primary',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    Register Center Worker
                </Typography>

                {!isRegistered ? (
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="First Name"
                                type="text"
                                value={registrationData.firstName}
                                onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                                required
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                            />
                            <TextField
                                label="Last Name"
                                type="text"
                                value={registrationData.lastName}
                                onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                                required
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={isSubmitting}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: '24px',
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: 'action.disabledBackground',
                                    }
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
                    <Stack spacing={3} alignItems="center">
                        <CheckCircle sx={{
                            fontSize: 60,
                            color: 'primary.main'
                        }} />
                        <Typography
                            variant="h5"
                            sx={{ color: 'text.primary' }}
                        >
                            Account Created!
                        </Typography>
                        <Button
                            component={Link}
                            to="/ManageAccounts"
                            variant="contained"
                            sx={{
                                bgcolor: 'primary.main',
                                borderRadius: '24px',
                                '&:hover': {
                                    bgcolor: 'primary.dark'
                                }
                            }}
                        >
                            Back to Account Manager
                        </Button>
                    </Stack>
                )}
            </Box>
        </Box>
    );
};

export default RegisterCenterWorker;
