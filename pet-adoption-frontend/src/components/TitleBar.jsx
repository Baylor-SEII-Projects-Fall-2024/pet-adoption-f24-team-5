import { Button, Toolbar, Typography, AppBar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { clearToken } from '../utils/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector, useDispatch } from "react-redux";

const TitleBar = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
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

    const handleLogout = () => {
        dispatch(clearToken()); // Clear token in Redux
        navigate('/Login'); // Redirect to login page
    };

    return (
        <AppBar
            position="static"
            sx={{
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
                boxShadow: 'none',
            }}
        > { }

            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Button color="inherit" component={Link} to="/">DogPile Solutions</Button>
                </Typography>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                    Welcome {emailAddress}
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
