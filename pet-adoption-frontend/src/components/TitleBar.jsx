import { clearToken, setDisplayName } from '../utils/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/tokenUtils";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Button, Toolbar, Typography, AppBar, CircularProgress } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import axios from '../utils/axiosConfig';

const TitleBar = () => {
    const [emailAddress, setEmailAddress] = useState('');
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(null); // Use null to differentiate between loading and zero
    const [userId, setUserId] = useState(null);
    const displayName = useSelector((state) => state.user.displayName);
    const [authority, setAuthority] = useState('');
    const token = useSelector((state) => state.user.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Hook to detect route changes

    const fetchUserData = async () => {
        try {
            const email = getSubjectFromToken(token);
            setEmailAddress(email);
            const userType = getAuthorityFromToken(token);
            setAuthority(userType);

            const response = await axios.get(`${API_URL}/api/users/getUser`, {
                params: { emailAddress: email },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userData = response.data;
            const displayName =
                userType === 'CenterOwner' || userType === 'CenterWorker'
                    ? userData.centerName || 'Adoption Center'
                    : `${userData.firstName} ${userData.lastName}`;

            dispatch(setDisplayName(displayName));
            setUserId(userData.id);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUnreadMessagesCount = async () => {
        if (!userId || !token) return; // Ensure userId and token are available
        try {
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
            console.log('Unread messages response:', response.data);
            setUnreadMessagesCount(response.data?.length || 0);
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    useEffect(() => {
        fetchUnreadMessagesCount();
    }, [userId, location.pathname]); // Fetch messages on userId change or page navigation

    const handleLogout = () => {
        dispatch(clearToken());
        navigate('/Login');
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
                    Welcome {displayName || 'User'}!
                </Typography>

                {/* Add navigation for Center and Owner */}
                {(authority === 'CenterOwner' || authority === 'CenterWorker') && (
                    <>
                        <Button color="inherit" component={Link} to="/EventManager">Event Manager</Button>
                        <Button color="inherit" component={Link} to="/PetManager">Pet Manager</Button>
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

                {/* Messages Button with Unread Count (Hide badge when on Messages page) */}
                <Button color="inherit" component={Link} to="/Messages">
                    {location.pathname !== '/Messages' &&
                        (unreadMessagesCount === null ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <Badge badgeContent={unreadMessagesCount} color="error">
                                Messages
                            </Badge>
                        ))}
                    {location.pathname === '/Messages' && <span>Messages</span>}
                </Button>

                <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                <Button color="inherit" onClick={handleLogout}>Log Out</Button>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
