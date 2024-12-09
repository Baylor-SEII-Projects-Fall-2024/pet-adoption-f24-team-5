import React, { useState } from 'react';
import { Button, TextField, Stack, Typography, Box, InputAdornment, Grid } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AccountCircle, Lock } from '@mui/icons-material'; // Icons for inputs
import axios from '../utils/redux/axiosConfig';
import { useDispatch } from 'react-redux';
import { setToken } from '../utils/redux/userSlice';
import { handleLogIn } from '../utils/login/logIn';
import Image from 'next/image';

const Login = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        handleLogIn(emailAddress, password, setErrorMessage, navigate, dispatch);
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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Image
                        src="/favicon.ico"
                        alt="DogPile Logo"
                        width={64}
                        height={64}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            mt: 2
                        }}
                    >
                        DogPile Solutions
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 4,
                        color: 'text.primary',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    Login
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
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

                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                textAlign="center"
                            >
                                {errorMessage}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '24px',
                                py: 1.5,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            Login
                        </Button>
                    </Stack>
                </form>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            style={{
                                color: 'inherit',
                                textDecoration: 'none',
                                fontWeight: 600
                            }}
                        >
                            Sign Up
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;
