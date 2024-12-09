import { clearToken, setDisplayName } from '../../utils/redux/userSlice'; // Adjust the path as necessary
import { getAuthorityFromToken, getSubjectFromToken } from "@/utils/redux/tokenUtils";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Button, Toolbar, Typography, AppBar, CircularProgress } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getUser } from "@/utils/user/getUser";
import { getAllUnreadsForUser } from "@/utils/user/getAllUnreadsForUser";
import { NotificationsOutlined, Settings, Logout } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';

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
    const theme = useTheme();

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
        if (!userId || !token) return;
        try {
            const response = await getAllUnreadsForUser(token, userId);
            const count = response?.data?.length || 0;
            console.log('Unread messages count:', count);
            setUnreadMessagesCount(count);
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    useEffect(() => {
        // Initial fetch
        if (userId && token) {
            fetchUnreadMessagesCount();
        }

        // Set up polling interval
        const interval = setInterval(() => {
            if (userId && token) {
                fetchUnreadMessagesCount();
            }
        }, 3000); // Check every 3 seconds

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, [userId, token]); // Remove location.pathname dependency

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
    const centerWorkerNavItems = [
        { label: 'Pets', path: '/PetManager' },
        { label: 'Events', path: '/EventManager' },
    ];

    return (
        <AppBar
            position="static"
            sx={{
                height: '8vh',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo/Home Section */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/credits"
                        sx={{
                            fontSize: '1.4rem',
                            textTransform: 'none',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px',
                            borderRadius: '24px',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        <Image
                            src="/favicon.ico"
                            alt="DogPile Logo"
                            width={48}
                            height={48}
                        />
                        DogPile Solutions
                    </Button>
                </div>

                {/* Navigation Section */}
                <div style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '16px'
                }}>
                    {authority === 'Owner' && ownerNavItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                            sx={{
                                textTransform: 'none',
                                borderRadius: '24px',
                                px: 2,
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            {item.label}
                        </Button>
                    ))}

                    {authority === 'CenterOwner' && centerNavItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                            sx={{ textTransform: 'none' }}
                        >
                            {item.label}
                        </Button>
                    ))}

                    {authority === 'CenterWorker' && centerWorkerNavItems.map((item) => (
                        <Button
                            key={item.path}
                            color="inherit"
                            component={Link}
                            to={item.path}
                            sx={{ textTransform: 'none' }}
                        >
                            {item.label}
                        </Button>
                    ))}
                </div>

                {/* User Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    width: '250px',
                    justifyContent: 'flex-end'
                }}>
                    {/* Messages Icon */}
                    <Tooltip title="Messages">
                        <IconButton
                            color="inherit"
                            component={Link}
                            to="/Messages"
                            size="small"
                            sx={{
                                padding: '8px',
                                borderRadius: '12px',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            {unreadMessagesCount === null ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <Badge
                                    badgeContent={unreadMessagesCount}
                                    color="error"
                                    invisible={!unreadMessagesCount || unreadMessagesCount <= 0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -3,
                                            top: 3,
                                            fontSize: '0.6rem',
                                            height: '14px',
                                            minWidth: '14px'
                                        }
                                    }}
                                >
                                    <NotificationsOutlined sx={{ fontSize: '1.2rem' }} />
                                </Badge>
                            )}
                        </IconButton>
                    </Tooltip>

                    {/* Settings Icon */}
                    <Tooltip title="Settings">
                        <IconButton
                            color="inherit"
                            component={Link}
                            to="/Settings"
                            size="small"
                            sx={{ padding: '8px' }}
                        >
                            <Settings sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                    </Tooltip>

                    {/* Logout Icon */}
                    <Tooltip title="Logout">
                        <IconButton
                            color="inherit"
                            onClick={handleLogout}
                            size="small"
                            sx={{ padding: '8px' }}
                        >
                            <Logout sx={{ fontSize: '1.2rem' }} />
                        </IconButton>
                    </Tooltip>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default TitleBar;
