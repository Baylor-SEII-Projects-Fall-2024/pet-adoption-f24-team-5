import React, { useState } from 'react';
import {
    Button, TextField, Stack, Typography, Box, InputAdornment, CircularProgress
} from '@mui/material';
import { Email, Lock, Phone, CheckCircle } from '@mui/icons-material'; // Import Check Icon
import axios from 'axios';
import { API_URL } from "@/constants";
import {Link} from "react-router-dom";
import ManageAccounts from "@/pages/ManageAccounts";
import {getSubjectFromToken} from "@/utils/tokenUtils";
import {useSelector} from "react-redux";
import TitleBar from "@/components/TitleBar";

const RegisterCenterWorker = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [centerID, setCenterID] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
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
        setPhoneNumber(formattedNumber);
    };

    const getCenterID = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/adoption-center/getCenterID/${getSubjectFromToken(token)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response.data);
            return response.data; // Return the center_id
        } catch (err) {
            console.error('An error occurred while fetching the center ID:', err);
            alert('An error occurred. Please try again later.');
            throw err; // Re-throw the error to handle it in handleSubmit
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const id = await getCenterID();
            console.log("Center ID: " + id);
            const registrationData = {
                firstName,
                lastName,
                emailAddress,
                password,
                userType: "CenterWorker",
                age: parseInt(age, 10),
                phoneNumber,
                centerID : id,
            };
            console.log(registrationData);
            await axios.post(`${API_URL}/api/auth/register/center-worker`, registrationData);
            setIsRegistered(true);
        } catch (err) {
            console.error('An error occurred during registration:', err);
            alert('An error occurred during registration. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #FFFFFF 30%, #E7E9EC 90%)',
            }}
        >

            <Box sx={{ flexShrink: 0 }}>
                <TitleBar />
            </Box>


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
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Phone Number"
                                    type="tel"
                                    value={phoneNumber}
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
