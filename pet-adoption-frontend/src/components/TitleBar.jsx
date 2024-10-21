import { Button, Toolbar, Typography, AppBar} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {getAuthorityFromToken, getSubjectFromToken} from "@/utils/tokenUtils";
import {useSelector} from "react-redux";
import { API_URL } from "../constants";
import axios from 'axios';

const TitleBar = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchEmailAddress = async () => {
            try {
                setEmailAddress(getSubjectFromToken(token));
                setAuthority(getAuthorityFromToken(token));
            } catch (error) {
                console.error('Error fetching email address:', error);
            }
        };

        fetchEmailAddress();
    }, []);

    useEffect(() => {
        const fetchDisplayName = async () => {
            try{
                console.log("Email: " + emailAddress);
                const response = await axios.get(`${API_URL}/api/users/getDisplayName`, {
                    params: {emailAddress: emailAddress},
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setDisplayName(response.data);
            }
            catch (error) {
                console.error("Error fetching first name: ", error);
            }
        }

        fetchDisplayName();
    }, [emailAddress])

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove token from local storage
        navigate('/Login'); // Redirect to login page
    };
    return (
        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
                boxShadow: 'none',
            }}
        > {}

            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">DogPile Solutions</Button>
                </Typography>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'left' }}>
                    Welcome {displayName}
                </Typography>

                {(authority === 'CenterOwner' || authority === 'CenterWorker') && (
                    <>
                        <Button color="inherit" component={Link} to="/CreateEvent">Create Event</Button>
                        <Button color="inherit" component={Link} to="/PetManager">Pet Manager</Button>
                    </>
                )}

                {(authority === 'Owner') && (
                    <>
                        <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                        <Button color="inherit" component={Link} to="/LocalAdoptionCenter">Local Adoption Center</Button>
                    </>
                )}

                <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                <Button color="inherit" onClick={handleLogout}>Log Out</Button>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
