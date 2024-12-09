import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    TextField,
    IconButton,
    Typography,
    Stack,
    Divider,
    Button,
    Badge,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { API_URL } from '@/constants';
import axios from 'axios';
import PetCard from '@/components/petCard/PetCard';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';
import { useSelector } from 'react-redux';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const token = useSelector((state) => state.user.token);
    const [petSelectionOpen, setPetSelectionOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isNewConversation, setIsNewConversation] = useState(false);


    useEffect(() => {
        if (userData) {
            fillDrawer(userData.id, userData.userType);
        }
    }, [userData]);

    useEffect(() => {
        if (isNewConversation && messages.length > 0) {
            scrollToBottom();
            setIsNewConversation(false); // Reset after scrolling
        }
    }, [messages, isNewConversation]);


    const handleConversationClick = (conversationId) => {
        setCurrentConversationId(conversationId);
        setHasScrolled(false); // Reset scrolling state
        loadMessages(conversationId, userData.id);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    useEffect(() => {
        if (!hasScrolled && messages.length > 0) {
            scrollToBottom();
            setHasScrolled(true); // Mark as scrolled
        }
    }, [messages, hasScrolled]);


    const handleOpenPetSelection = () => {
        setPetSelectionOpen(true);
    };

    // Function to close the pet selection dialog
    const handleClosePetSelection = () => {
        setPetSelectionOpen(false);
    };

    // Example pet data for testing
    /*const examplePetData = {
        petId: 101,
        petName: 'Buddy',
        species: 'Dog',
        breed: 'Labrador',
        color: 'Yellow',
        sex: 'Male',
        age: 3,
        description: 'A friendly Labrador.',
        imageName: 'buddy.jpg',
        // Include other necessary fields
    };*/

    const messagesEndRef = useRef(null); // Reference to the end of messages

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    /*useEffect(() => {
        scrollToBottom();
    }, [messages]);*/

    const currentConversation = conversations.find(
        (conv) => conv.conversationId === currentConversationId
    );

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (messageInput.trim() === '' || !currentConversationId || !userData) return;

        const receiverId =
            userData.id === currentConversation.ownerId
                ? currentConversation.centerId
                : currentConversation.ownerId;

        try {
            const url = `${API_URL}/api/message/sendMessage`;

            const newMessageData = {
                conversationId: currentConversationId,
                senderId: userData.id,
                receiverId: receiverId,
                message: messageInput,
                isRead: false,
            };

            const response = await axios.post(url, newMessageData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const newMessage = response.data;

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput('');

            // Force scroll to bottom after sending
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    // Function to handel sending the petcard
    // Function to send a PetCard message
    const handleSendPetCardMessage = async (petData) => {
        if (!currentConversationId || !userData) return;

        const receiverId =
            userData.id === currentConversation.ownerId
                ? currentConversation.centerId
                : currentConversation.ownerId;

        const petDataJson = JSON.stringify(petData);
        const messageContent = `PETCARD_JSON:${petDataJson}`;

        const newMessageData = {
            conversationId: currentConversationId,
            senderId: userData.id,
            receiverId: receiverId,
            message: messageContent,
            isRead: false,
        };

        try {
            const response = await axios.post(`${API_URL}/api/message/sendMessage`, newMessageData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const newMessage = response.data;

            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput('');

            // Force scroll to bottom after sending
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        } catch (error) {
            console.error('Failed to send PetCard message', error);
        }
    };


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    // Modified loadMessages to accept an optional parameter to control unread message reset
    const loadMessages = async (conversationId, userId, resetUnread = true) => {
        if (!userData) {
            console.log('userData not available yet');
            return;
        }

        try {
            const url = `${API_URL}/api/message/getMessages`;

            const response = await axios.post(
                url,
                null,
                {
                    params: { conversationId, userId },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            let newMessages = response.data;
            newMessages.sort((a, b) => new Date(a.date) - new Date(b.date));
            setMessages(newMessages);

            // Reset unread messages for this conversation only if resetUnread is true
            if (resetUnread) {
                if (userData.userType === 'Owner') {
                    await axios.post(
                        `${API_URL}/api/conversation/reset-owner-unread/${conversationId}`,
                        null,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    await axios.post(
                        `${API_URL}/api/conversation/reset-center-unread/${conversationId}`,
                        null,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                // Update the conversation's unread message count in state
                setConversations((prevConversations) =>
                    prevConversations.map((conv) =>
                        conv.conversationId === conversationId
                            ? {
                                ...conv,
                                unreadMessagesOwner: userData.userType === 'Owner' ? 0 : conv.unreadMessagesOwner,
                                unreadMessagesCenter: userData.userType !== 'Owner' ? 0 : conv.unreadMessagesCenter,
                            }
                            : conv
                    )
                );
            }
        } catch (error) {
            console.error('Failed to load messages', error);
        }
    };

    const fetchUser = async (token) => {
        try {
            let email = '';

            if (token) {
                const subject = getSubjectFromToken(token);
                if (subject) {
                    email = subject;
                } else {
                    throw new Error('Invalid token: Subject not found.');
                }
            } else {
                throw new Error('Token is required to fetch user information.');
            }

            const url = `${API_URL}/api/users/getUser?emailAddress=${email}`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            return response;
        } catch (error) {
            console.error('Failed to fetch user', error);
            throw error;
        }
    };

    const fetchOtherUserNameForConversation = async (conversationId, userType) => {
        try {
            const url = `${API_URL}/api/conversation/getOtherUserName`;

            const response = await axios.post(
                url,
                null,
                {
                    params: { t: userType, conversationId: conversationId },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Failed to fetch other user name', error);
            return `Conversation ${conversationId}`;
        }
    };

    const fillDrawer = async (userId, userType) => {
        if (!userId || !userType) {
            console.log('Missing userId or userType in fillDrawer');
            return;
        }

        try {
            const url = `${API_URL}/api/conversation/getAllConversations`;

            const response = await axios.post(
                url,
                null,
                {
                    params: { userId },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log('Conversations fetched:', response.data);

            const conversationsData = response.data;

            // For each conversation, fetch the other user's name
            const updatedConversations = await Promise.all(conversationsData.map(async (conversation) => {
                const otherUserName = await fetchOtherUserNameForConversation(conversation.conversationId, userType);
                return {
                    ...conversation,
                    otherUserName,
                };
            }));

            setConversations(updatedConversations);

            // Only load messages if we have conversations and userData is available
            if (updatedConversations.length > 0 && !currentConversationId) {
                setCurrentConversationId(updatedConversations[0].conversationId);
                if (userData) {
                    await loadMessages(updatedConversations[0].conversationId, userId);
                }
            }
        } catch (error) {
            console.error('Failed to get conversations', error);
        }
    };

    const startup = async () => {
        console.log('Messages component has loaded.');

        try {
            // Fetch user information
            const response = await fetchUser(token);
            console.log('User data:', response.data);
            const userDataResponse = response.data;

            setUserData(userDataResponse); // Set the userData state
            setUserEmail(userDataResponse.emailAddress);

            // Wait for setState to complete using a Promise
            await new Promise(resolve => setTimeout(resolve, 0));

            const userId = userDataResponse.id;
            const userType = userDataResponse.userType;

            // Now that we have userData, fetch conversations
            await fillDrawer(userId, userType);
        } catch (error) {
            console.error('Error during startup:', error);
        }
    };


    // Use useEffect to call startup when the component mounts
    useEffect(() => {
        startup();
    }, []); // Empty dependency array ensures this runs once on mount

    // Polling for new messages every 3 seconds
    useEffect(() => {
        let intervalId;

        const startPolling = () => {
            intervalId = setInterval(async () => {
                if (currentConversationId && userData) {
                    try {
                        await loadMessages(currentConversationId, userData.id, false); // Don't reset unread during polling
                    } catch (error) {
                        console.error('Error polling for new messages:', error);
                    }
                }
            }, 3000);
        };

        if (currentConversationId && userData) {
            startPolling();
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [currentConversationId, userData]);


    return (
        <Box
            sx={{
                height: '92vh', // Full viewport height minus header
                display: 'flex',
                bgcolor: 'background.default',
                overflow: 'hidden', // Prevent scrolling of the entire container
            }}
        >
            {/* Drawer */}
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            position: 'relative', // Change from fixed to relative
                            height: '100%',
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        },
                    }}
                >
                    <List sx={{ p: 0 }}>
                        {conversations.map((conversation) => (
                            <ListItem
                                button
                                key={conversation.conversationId}
                                selected={conversation.conversationId === currentConversationId}
                                onClick={() => handleConversationClick(conversation.conversationId)}
                                sx={{
                                    py: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    '&.Mui-selected': {
                                        bgcolor: 'secondary.light', // Light beige background for selected conversation
                                        '&:hover': {
                                            bgcolor: 'secondary.light',
                                        },
                                    },
                                    '&:hover': {
                                        bgcolor: 'secondary.lighter', // Even lighter beige for hover
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <Typography sx={{
                                                fontWeight: 500,
                                                color: 'text.primary',
                                            }}>
                                                {conversation.otherUserName}
                                            </Typography>
                                            {(conversation.unreadMessagesOwner > 0 ||
                                                conversation.unreadMessagesCenter > 0) && (
                                                    <Badge
                                                        badgeContent={
                                                            userData?.userType === 'Owner'
                                                                ? conversation.unreadMessagesOwner
                                                                : conversation.unreadMessagesCenter
                                                        }
                                                        color="error"
                                                        sx={{ ml: 1 }}
                                                    />
                                                )}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Box>

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {/* Chat header */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {isMobile && (
                        <IconButton
                            color="primary"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                borderRadius: '12px',
                                '&:hover': {
                                    bgcolor: 'primary.lighter',
                                }
                            }}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.primary',
                            fontWeight: 600
                        }}
                    >
                        {currentConversation?.otherUserName || 'Select a conversation'}
                    </Typography>
                </Box>

                {/* Messages container */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 2,
                        bgcolor: 'background.default',
                    }}
                >
                    <Stack spacing={2}>
                        {messages.map((message) => {
                            const isCurrentUserSender = message.senderId === userData.id;

                            // Check if the message is a PetCard
                            if (message.message.startsWith('PETCARD_JSON:')) {
                                const petDataJson = message.message.replace('PETCARD_JSON:', '').trim();
                                let petData;
                                try {
                                    petData = JSON.parse(petDataJson);
                                } catch (error) {
                                    console.error('Invalid pet data in message:', error);
                                    return (
                                        <Box
                                            key={message.messageId}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                                maxWidth: '400px',
                                                alignSelf: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                            }}
                                        >
                                            <Box sx={{
                                                width: '100%',
                                                bgcolor: 'background.paper',  // White background for PetCards
                                                borderRadius: 2,
                                                p: 1,
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }}>
                                                <Typography color="error">Invalid pet data received.</Typography>
                                            </Box>
                                        </Box>
                                    );
                                }

                                return (
                                    <Box
                                        key={message.messageId}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                            width: '100%',
                                            maxWidth: '400px',
                                            alignSelf: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                            px: 0.5,
                                        }}
                                    >
                                        <Box sx={{
                                            bgcolor: 'background.paper', // White background for better contrast
                                            borderRadius: '16px',
                                            p: 1,
                                            boxShadow: '0 2px 4px rgba(139,115,85,0.1)', // Brown-tinted shadow
                                            border: '1px solid',
                                            borderColor: isCurrentUserSender
                                                ? 'primary.light'  // Lighter border for better aesthetics
                                                : 'secondary.light',
                                        }}>
                                            <PetCard
                                                pet={petData}
                                                expandable={true}
                                                saveable={false}
                                                likeable={false}
                                                contactable={false}
                                                size="default"
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: 'block',
                                                    textAlign: 'right',
                                                    mt: 0.5,
                                                    color: 'text.secondary',
                                                    px: 1, // Add some padding to align with the card
                                                }}
                                            >
                                                {new Date(message.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            } else {
                                // Render regular text messages
                                return (
                                    <Box
                                        key={message.messageId}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: '100%',
                                                p: 1.5,
                                                borderRadius: '16px',
                                                backgroundColor: isCurrentUserSender
                                                    ? 'primary.light' // Light brown for sent messages
                                                    : 'secondary.light', // Light beige for received messages
                                                border: '1px solid',
                                                borderColor: isCurrentUserSender
                                                    ? 'primary.main'
                                                    : 'secondary.main',
                                                boxShadow: '0 2px 4px rgba(139,115,85,0.1)', // Brown-tinted shadow
                                            }}
                                        >
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: 'text.primary',
                                                    fontWeight: 400
                                                }}
                                            >
                                                {message.message}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                display="block"
                                                align="right"
                                                sx={{
                                                    color: 'text.secondary',
                                                    mt: 0.5
                                                }}
                                            >
                                                {new Date(message.date).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            }
                        })}
                        <div ref={messagesEndRef} />
                    </Stack>
                </Box>

                {/* Message input */}
                <Box
                    sx={{
                        p: 2,
                        bgcolor: 'background.paper',
                        borderTop: 1,
                        borderColor: 'divider',
                    }}
                >
                    <form onSubmit={handleSendMessage}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                variant="outlined"
                                placeholder="Type a message"
                                fullWidth
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                disabled={!currentConversation}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '24px', // Pill-shaped input
                                        '&.Mui-focused': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: 2,
                                            },
                                        },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    bgcolor: 'primary.main',
                                    borderRadius: '24px',
                                    px: 3,
                                    '&:hover': {
                                        bgcolor: 'primary.dark',
                                    },
                                }}
                                disabled={!currentConversation}
                            >
                                Send
                            </Button>
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Messages;