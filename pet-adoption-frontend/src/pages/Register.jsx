    import React, { useState } from 'react';
import { Button, Stack } from "@mui/material";
import axios from 'axios';
import { TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { setToken } from '../utils/userSlice'; // Import the setToken action

const Register = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [centerName, setCenterName] = useState('');
    const [centerCity, setCenterCity] = useState('');
    const [centerAddress, setCenterAddress] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [centerState, setCenterState] = useState('');
    const [centerZip, setCenterZip] = useState('');
    const [numberOfPets, setNumberOfPets] = useState('');

    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate(); // Initialize useNavigate

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
            numberOfPets: parseInt(numberOfPets, 10),
        } : {
            emailAddress,
            password,
            userType: 'Owner',
            age: parseInt(age, 10),
            phoneNumber,
        };

        const url = userType === 'owner'
            ? 'http://localhost:8080/api/auth/register/adoption-center'
            : 'http://localhost:8080/api/auth/register/owner';


        axios
            .post( url, registrationData)
            .then(() => {
                // After registration, call loginUser to log in the user
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
            .post('http://localhost:8080/api/auth/authenticate', loginRequest, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                const { token } = res.data;
                localStorage.setItem('token', token); // Store the token
                dispatch(setToken(token)); // Dispatch the setToken action to update Redux state
                alert('Registration and login successful!');
                navigate('/'); // Redirect to the home page or dashboard
            })
            .catch((err) => {
                console.error('An error occurred during login:', err);
                alert('An error occurred during login. Please try again later.');
            });
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
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
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        fullWidth
                    />
                    <TextField
                        label="Phone Number"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        fullWidth
                    />
                    {userType === 'owner' && (
                        <TextField
                            label="Adoption Center Name"
                            type="text"
                            value={centerName}
                            onChange={(e) => setCenterName(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'owner' && (
                        <TextField
                            label="Address"
                            type="text"
                            value={centerAddress}
                            onChange={(e) => setCenterAddress(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'owner' && (
                        <TextField
                            label="City"
                            type="text"
                            value={centerCity}
                            onChange={(e) => setCenterCity(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'owner' && (
                        <TextField
                            label="State"
                            type="text"
                            value={centerState}
                            onChange={(e) => setCenterState(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'owner' && (
                        <TextField
                            label="Zip Code"
                            type="text"
                            value={centerZip}
                            onChange={(e) => setCenterZip(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'owner' && (
                        <TextField
                            label="Center Pet Count"
                            type="number"
                            value={numberOfPets}
                            onChange={(e) => setNumberOfPets(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                    {userType === 'user' && (
                        <TextField
                            label="Age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            required
                            fullWidth
                        />
                    )}
                </Stack>
                <Stack direction="row" spacing={2} mt={2}>
                    <Button variant="contained" component={Link} to="/Login">Login</Button>
                    <Button type="submit" variant="contained">Register</Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Register;
