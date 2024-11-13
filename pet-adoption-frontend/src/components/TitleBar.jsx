import { clearToken, setDisplayName } from '../utils/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Button, Toolbar, Typography, AppBar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import axios from 'axios';

const TitleBar = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // State to store unread messages count
    const [userId, setUserId] = useState(null); // State to store userId
    const displayName = useSelector((state) => state.user.displayName);
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = getSubjectFromToken(token);
                setEmailAddress(email);
                const userType = getAuthorityFromToken(token);
                setAuthority(userType);

                // Fetch full user data including userId and centerName
                const response = await axios.get(`${API_URL}/api/users/getUser`, {
                    params: { emailAddress: email },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const userData = response.data;
                let displayName;

                // Set display name based on user type
                if (userType === 'CenterOwner' || userType === 'CenterWorker') {
                    displayName = userData.centerName || 'Adoption Center';
                } else {
                    displayName = `${userData.firstName} ${userData.lastName}`;
                }

                dispatch(setDisplayName(displayName));
                setUserId(userData.id); // Store userId

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchData();
    }, [token, dispatch]);

    useEffect(() => {
        const fetchUnreadMessagesCount = async () => {
            try {
                if (!userId) {
                    console.error('User ID is not available yet.');
                    return;
                }

                const response = await axios.post(
                    `${API_URL}/api/conversation/getAllUnreadForUser`,
                    null,
                    {
                        params: { userId },
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setUnreadMessagesCount(response.data.length); // Update unread messages count
            } catch (error) {
                console.error('Error fetching unread messages count:', error);
            }
        };

        fetchUnreadMessagesCount();
    }, [token, userId]); // Fetch unread messages count whenever the token or userId changes

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
        >
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
                        <Button color="inherit" component={Link} to="/ManageAccounts">Manage Worker Accounts</Button>
                    </>
                )}

                {(authority === 'Owner') && (
                    <>
                        <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                        <Button color="inherit" component={Link} to="/AvailablePets">All Pets</Button>
                        <Button color="inherit" component={Link} to="/LocalAdoptionCenter">Local Adoption Center</Button>
                        <Button color="inherit" component={Link} to="/EventManager">All Events</Button>
                        <Button color="inherit" component={Link} to="/preferences">Preferences</Button>
                    </>
                )}

                {/* Messages Button with Unread Count */}
                <Button color="inherit" component={Link} to="/Messages">
                    <Badge badgeContent={unreadMessagesCount} color="error">
                        Messages
                    </Badge>
                </Button>

                <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                <Button color="inherit" onClick={handleLogout}>Log Out</Button>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
