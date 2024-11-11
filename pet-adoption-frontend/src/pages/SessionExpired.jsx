import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearToken } from '@/utils/userSlice';

const SessionExpired = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = () => {
        dispatch(clearToken());
        navigate('/Login');
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
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
                    Session Expired
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    Your session has expired. Please log in again to continue.
                </Typography>
                <Button
                    onClick={handleLogin}
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
                    Return to Login
                </Button>
            </Box>
        </Box>
    );
};

export default SessionExpired;
