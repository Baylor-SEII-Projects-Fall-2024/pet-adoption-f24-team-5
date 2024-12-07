import { clearToken, setDisplayName } from '../../utils/redux/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/redux/tokenUtils";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Button, Toolbar, Typography, AppBar, CircularProgress } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUser } from "@/utils/user/getUser";
import { getAllUnreadsForUser } from "@/utils/user/getAllUnreadsForUser";

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

            const response = await getUser(token, email);

            const userData = response;
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
            const response = await getAllUnreadsForUser(token, userId);
            console.log('Unread messages response:', response);
            setUnreadMessagesCount(response?.length || 0);
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

    // Navigation menus based on user type
    const ownerNavItems = [
        { label: 'Adoption Centers', path: '/LocalAdoptionCenter' },
        { label: 'Available Pets', path: '/AvailablePets' },
        { label: 'Find A Pet', path: '/FindAPet' },
    ];

    const centerNavItems = [
        { label: 'Pets', path: '/PetManager' },
        { label: 'Events', path: '/EventManager' },
        { label: 'Workers', path: '/ManageAccounts' },
    ];

    return (
        <AppBar
            position="static"
            sx={{
                height: '8vh',
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo/Home Section */}
                <Button color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
                    DogPile Solutions
                </Button>

                {/* Navigation Section */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    {authority === 'Owner' && ownerNavItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                        >
                            {item.label}
                        </Button>
                    ))}

                    {(authority === 'CenterOwner' || authority === 'CenterWorker') &&
                        centerNavItems.map((item) => (
                            <Button
                                key={item.path}
                                color="inherit"
                                component={Link}
                                to={item.path}
                            >
                                {item.label}
                            </Button>
                        ))}
                </div>

                {/* User Section */}
                <div>
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
                    <Button color="inherit" component={Link} to="/credits">Credits</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" onClick={handleLogout}>Log Out</Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
