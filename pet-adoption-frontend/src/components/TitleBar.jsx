import { clearToken, setDisplayName } from '../utils/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector, useDispatch } from "react-redux";
import { Button, Toolbar, Typography, AppBar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import axios from '../utils/axiosConfig';


const TitleBar = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const displayName = useSelector((state) => state.user.displayName);
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchData = async () => {
            try {
                setEmailAddress(getSubjectFromToken(token));
                setAuthority(getAuthorityFromToken(token));

                const response = await axios.get(`${API_URL}/api/users/getDisplayName`, {
                    params: { emailAddress: getSubjectFromToken(token) },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });
                dispatch(setDisplayName(response.data));
            } catch (error) {
                console.error('Error fetching email address:', error);
            }
        };

        fetchData();
    }, [token, dispatch]);

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
                    Welcome {displayName}!
                </Typography>

                {(authority === 'CenterOwner' || authority === 'CenterWorker') && (
                    <>
                        <Button color="inherit" component={Link} to="/EventManager">Event Manager</Button>
                        <Button color="inherit" component={Link} to="/PetManager">Pet Manager</Button>

                    </>
                )}

                {(authority === 'CenterOwner') && (
                    <>
                        <Button color="inherit" component={Link} to="/ManageAccounts">Manage Worker Accounts</Button>


                    </>
                )}

                {(authority === 'Owner') && (
                    <>
                        <Button color="inherit" component={Link} to="/SearchEngine">Recommendation Engine</Button>
                        <Button color="inherit" component={Link} to="/AvailablePets">All Pets</Button>
                        <Button color="inherit" component={Link} to="/LocalAdoptionCenter">Local Adoption Center</Button>
                        <Button color="inherit" component={Link} to="/EventManager">All Events</Button>
                        <Button color="inherit" component={Link} to="/preferences">Preferences</Button>
                        <Button color="inherit" component={Link} to="/SavedPets">Saved Pets</Button>
                    </>
                )}

                <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                <Button color="inherit" onClick={handleLogout}>Log Out</Button>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
