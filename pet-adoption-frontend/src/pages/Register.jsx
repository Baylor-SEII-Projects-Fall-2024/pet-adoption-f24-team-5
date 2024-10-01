import React, { useState } from 'react';
import { Button, Stack } from "@mui/material";
import axios from 'axios';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import { Box, Typography } from '@mui/material';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [adoptionCenterName, setAdoptionCenterName] = useState('');
    const [age, setAge] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userName, setUserName] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        const registrationData = {
            email,
            password,
            userType,
            age,
            phoneNumber,
            userName
        };

        axios
            .post('http://localhost:8080/api/users/register', registrationData)
            .then((res) => {
                alert('Registration successful! Your user ID is: ' + res.data);
                setEmail('');
                setPassword('');
                setUserType('');
                setAdoptionCenterName('');
                setAge('');
                setPhoneNumber('');
                setUserName('');
            })
            .catch((err) => {
                console.error('An error occurred during registration:', err);
                alert('An error occurred during registration. Please try again later.');
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
                        <MenuItem value="owner">Adoption Center Owner</MenuItem>
                        <MenuItem value="employee">Adoption Center Employee</MenuItem>
                        <MenuItem value="user">Pet Owner</MenuItem>
                    </TextField>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        label="User Name"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
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
                            value={adoptionCenterName}
                            onChange={(e) => setAdoptionCenterName(e.target.value)}
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