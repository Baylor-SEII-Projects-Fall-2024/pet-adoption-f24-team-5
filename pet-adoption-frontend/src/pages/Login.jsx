import React, { useState } from 'react';
import { Button, Stack } from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';
import Home from './home';

const Login = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginRequest = {
            emailAddress,
            password
        };

        axios
            .post('http://localhost:8080/api/auth/authenticate', loginRequest)
            .then((res) => {

                if (res.status !== 401) {
                    localStorage.setItem('token', res.data.token);
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
        <div>
            <h1>Welcome to the Login Page!</h1>
            <h3>Please Enter Your login:</h3>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
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
                    <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained">Login</Button>
                        <Button variant="contained" component={Link} to="/Register">Register</Button>
                    </Stack>
                </Stack>
            </form>
        </div>
    );
};

export default Login;