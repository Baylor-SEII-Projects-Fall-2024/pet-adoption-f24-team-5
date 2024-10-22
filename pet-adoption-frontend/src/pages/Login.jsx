import React, { useState } from 'react';
import { Button, TextField, Stack, Typography, Box, InputAdornment, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle, Lock } from '@mui/icons-material'; // Icons for inputs
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../utils/userSlice';
import { API_URL } from "@/constants";

const Login = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginRequest = {
            emailAddress,
            password
        };

        axios
            .post(`${API_URL}/api/auth/authenticate`, loginRequest)
            .then((res) => {
                if (res.status !== 401) {
                    dispatch(setToken(res.data.token));
                    setEmailAddress('');
                    setPassword('');
                    navigate('/');
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 401) {
                    alert(err.response.data);
                } else {
                    console.error('An unexpected error occurred:', err);
                    alert('An unexpected error occurred. Please try again later.');
                }
            });
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)', // Background gradient
            }}
        >
            <Box
                sx={{
                    width: '400px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                    padding: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2} marginTop={2}>
                        {/* Email Input */}
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
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {/* Password Input */}
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


                        {/* Login Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: 'linear-gradient(90deg, #43cea2, #185a9d)',
                                color: 'white',
                                padding: '10px 0',
                                borderRadius: '50px',
                                marginTop: 2,
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #185a9d, #43cea2)',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Stack>
                </form>

                {/* Sign Up Link */}
                <Typography variant="body2" marginTop={2}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#43cea2', textDecoration: 'none' }}>
                        Sign Up
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;
