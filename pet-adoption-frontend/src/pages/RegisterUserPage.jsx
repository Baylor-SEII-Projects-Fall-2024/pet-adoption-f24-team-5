import React, { useState } from 'react';
import {
    Button, TextField, Stack, Typography, Box, MenuItem, InputAdornment
} from '@mui/material';
import { Email, Lock, Phone } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleRegisterUser } from '../utils/register/registerUser';

const Register = () => {
    const [registrationData, setRegistrationData] = useState({
        userType: 'Owner',
        emailAddress: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        age: '',
        centerZip: '',
        numberOfPets: 0,
    });
    const [errorMessage, setErrorMessage] = useState('');

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
        setRegistrationData({ ...registrationData, phoneNumber: formattedNumber });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleRegisterUser(registrationData, navigate, dispatch, setErrorMessage);

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
                            value={registrationData.userType}
                            onChange={(e) => setRegistrationData({ ...registrationData, userType: e.target.value })}
                            required
                            fullWidth
                        >
                            <MenuItem value="CenterOwner">Adoption Center</MenuItem>
                            <MenuItem value="Owner">Pet Owner</MenuItem>
                        </TextField>

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
                            label="Phone Number"
                            type="tel"
                            value={registrationData.phoneNumber}
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

                        {registrationData.userType === 'CenterOwner' && (
                            <>
                                <TextField
                                    label="Adoption Center Name"
                                    value={registrationData.centerName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    value={registrationData.centerAddress}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerAddress: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="City"
                                    value={registrationData.centerCity}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerCity: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="State"
                                    value={registrationData.centerState}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerState: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Zip Code"
                                    value={registrationData.centerZip}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerZip: e.target.value })}
                                    required
                                    fullWidth
                                />
                                {/*<TextField*/}
                                {/*    label="Center Pet Count"*/}
                                {/*    type="number"*/}
                                {/*    value={registrationData.numberOfPets}*/}
                                {/*    onChange={(e) => {*/}
                                {/*        const value = e.target.value;*/}
                                {/*        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0 && parseInt(value, 10) <= 999)) {*/}
                                {/*            setRegistrationData({ ...registrationData, numberOfPets: value });*/}
                                {/*        }*/}
                                {/*    }}*/}
                                {/*    onKeyDown={(e) => {*/}
                                {/*        // Prevent non-numeric key presses*/}
                                {/*        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {*/}
                                {/*            e.preventDefault();*/}
                                {/*        }*/}
                                {/*    }}*/}
                                {/*    required*/}
                                {/*    fullWidth*/}
                                {/*/>*/}
                            </>
                        )}

                        {registrationData.userType === 'Owner' && (
                            <>
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
                                    label="Zip Code"
                                    type="text"
                                    value={registrationData.centerZip}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value))) {
                                            setRegistrationData({ ...registrationData, centerZip: value });
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
                                    value={registrationData.age}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0 && parseInt(value, 10) <= 100)) {
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
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: 100 }}
                                />
                            </>
                        )}

                        {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
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
