import React, {useState, useEffect} from 'react';
import {Button, Stack} from "@mui/material";
import axios from 'axios';

const SearchEngine = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false); // New state to trigger useEffect

    useEffect(() => {
        if (submitted) {
            const user = {
                email,
                password
            };

            axios
                .post('http://localhost:8080/api/users/login', user)
                .then((res) => {
                    alert(res.data.message);
                    setEmail('');
                    setPassword('');
                })
                .catch((err) => {
                    console.error(err); // Log the error for debugging
                    if (err.response) {
                        alert(`Error: ${err.response.data.message || err.response.status}`);
                    } else if (err.request) {
                        alert('No response from the server. Please try again later.');
                    } else {
                        alert('Error in setting up the request');
                    }
                })
                .finally(() => {
                    setSubmitted(false); // Reset the submitted state after the request
                });
        }
    }, [submitted]); // Trigger useEffect when `submitted` changes

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true); // Trigger the effect by setting `submitted` to true
    };

    return (
        <div>
            <h1>Welcome to the Login Page!</h1>
            <h3>Please Enter Your login:</h3>
            <Stack>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <p></p>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <p></p>
                    <Button type="submit" variant="contained">Login</Button>
                </form>
            </Stack>
            <p></p>
        </div>
    );
};

export default SearchEngine;
