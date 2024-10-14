import React, { useState } from 'react';
import { Button, Stack } from "@mui/material";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const REACT_APP_BACKEND_URL='http://34.27.150.181/api'
    const handleSubmit = (event) => {
        event.preventDefault();
        const loginRequest = {
            email,
            password
        };

        axios
                .post(REACT_APP_BACKEND_URL + '/users/login', loginRequest)
            .then((res) => {

                if (res.status !== 401) {
                    alert(
                        "ID: " + res.data.id + '\n' +
                        "Email Address: " + res.data.email + '\n' +
                        "UserType: " + res.data.userType + '\n' +
                        "Age: " + res.data.age + '\n' +
                        "Phone number: " + res.data.phoneNumber + '\n'
                    );

                    const userId = res.data.id;
                    localStorage.setItem('currentId', userId);

                    setEmail('');
                    setPassword('');
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