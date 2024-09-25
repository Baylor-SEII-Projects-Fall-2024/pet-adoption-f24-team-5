import React, {useState, useEffect} from 'react';
import {Button, Stack} from "@mui/material";
import axios from 'axios';

const SearchEngine = () => {
    const [email, setEmail] = useState('');
    const [id, setId] = useState('');
    const [userType ,setUserType] = useState('');
    const [age, setAge] = useState('');
    const[phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');


    const [submitted, setSubmitted] = useState(false);



    useEffect(() => {
        if (submitted) {
            const loginRequest = {
                email,
                password
            };

            const user = {
                id,
                email,
                password,
                userType,
                age,
                phoneNumber
            };

            console.log(loginRequest);

            axios
                .post('http://localhost:8080/api/users/login', loginRequest)
                .then((res) => {

                    console.log(res.status);
                    if(res.status !== 401){
                        alert(
                            "ID: " + res.data.id + '\n' +
                            "Email Address: " + user.email  + '\n' +
                            "UserType: "+ res.data.userType + '\n' +
                            "Age: " + res.data.age + '\n' +
                            "Phone number: "+ res.data.phoneNumber + '\n'
                        )

                        // Clear input fields by resetting state values
                        setEmail('');
                        setPassword('');
                    }
                })
                .catch((err) => {
                    // Handle the error when the status code is 401
                    if (err.response && err.response.status === 401) {
                        alert(err.response.data);
                    } else {
                        console.error('An unexpected error occurred:', err);
                        alert('An unexpected error occurred. Please try again later.');
                    }
                })
                .finally(() => {
                    setSubmitted(false); // Reset the submitted state after the request
                });

        }
    }, [submitted]);

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
