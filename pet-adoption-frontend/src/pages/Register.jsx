import React, { useState } from 'react';
import {
    Button, TextField, Stack, Typography, Box, MenuItem, InputAdornment
} from '@mui/material';
import { Email, Lock, Phone } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../utils/userSlice';
import { API_URL } from "@/constants";

const Register = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('user');
    const [centerName, setCenterName] = useState('');
    const [centerCity, setCenterCity] = useState('');
    const [centerAddress, setCenterAddress] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [centerState, setCenterState] = useState('');
    const [centerZip, setCenterZip] = useState('');
    const [numberOfPets, setNumberOfPets] = useState(0);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleSubmit = (event) => {
        event.preventDefault();
        const registrationData = userType === 'owner' ? {
            emailAddress,
            password,
            userType: 'CenterOwner',
            phoneNumber,
            centerName,
            centerAddress,
            centerCity,
            centerState,
            centerZip,
            numberOfPets,
        } : {
            firstName,
            lastName,
            emailAddress,
            password,
            userType: 'Owner',
            age: parseInt(age, 10),
            phoneNumber,
            centerZip
        };

        const url = userType === 'owner'
            ? `${API_URL}/api/auth/register/adoption-center`
            : `${API_URL}/api/auth/register/owner`;

        axios
            .post(url, registrationData)
            .then(() => {
                loginUser();
            })
            .catch((err) => {
                console.error('An error occurred during registration:', err);
                alert('An error occurred during registration. Please try again later.');
            });
    };

    const loginUser = () => {
        const loginRequest = { emailAddress, password };

        axios
            .post(`${API_URL}/api/auth/authenticate`, loginRequest)
            .then((res) => {
                const { token } = res.data;
                dispatch(setToken(token));
                navigate('/');
            })
            .catch((err) => {
                console.error('An error occurred during login:', err);
                alert('An error occurred during login. Please try again later.');
            });
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
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
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="User Type"
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                            required
                            fullWidth
                        >
                            <MenuItem value="owner">Adoption Center</MenuItem>
                            <MenuItem value="user">Pet Owner</MenuItem>
                        </TextField>

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
                            label="Phone Number"
                            type="tel"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            fullWidth
                            inputProps={{ maxLength: 12 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {userType === 'owner' && (
                            <>
                                <TextField
                                    label="Adoption Center Name"
                                    value={centerName}
                                    onChange={(e) => setCenterName(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    value={centerAddress}
                                    onChange={(e) => setCenterAddress(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="City"
                                    value={centerCity}
                                    onChange={(e) => setCenterCity(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="State"
                                    value={centerState}
                                    onChange={(e) => setCenterState(e.target.value)}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Zip Code"
                                    value={centerZip}
                                    onChange={(e) => setCenterZip(e.target.value)}
                                    required
                                    fullWidth
                                />
                            </>
                        )}

                        {userType === 'user' && (
                            <>
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
                                    label="Zip Code"
                                    type="text"
                                    value={centerZip}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value))) {
                                            setCenterZip(value);
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                            e.preventDefault();
                                        }
                                    }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 5 }}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Age"
                                    type="text" // Use text for more control over input
                                    value={age}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 100)) {
                                            setAge(value);
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
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: 100 }}
                                />
                            </>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: 'linear-gradient(90deg, #43cea2, #185a9d)',
                                color: 'white',
                                borderRadius: '50px',
                                padding: '10px 0',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #185a9d, #43cea2)',
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Stack>
                </form>

                <Typography variant="body2" marginTop={2}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#43cea2', textDecoration: 'none' }}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Register;
