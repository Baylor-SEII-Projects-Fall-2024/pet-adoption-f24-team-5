import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { API_URL } from '@/constants';
import axios from 'axios';
import { getSubjectFromToken } from '@/utils/tokenUtils';
import { useSelector } from 'react-redux';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [messages, setMessages] = useState([]); // Added messages state
    const [messageInput, setMessageInput] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userData, setUserData] = useState(null);
    const token = useSelector((state) => state.user.token);

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

            // Create the message object
            const newMessageData = {
                conversationId: currentConversationId,
                senderId: userData.id,
                receiverId: receiverId,
                message: messageInput,
                isRead: false,
            };

            // Send the message to the backend
            const response = await axios.post(url, newMessageData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            const newMessage = response.data; // The created message returned from the server

            // Update the messages state
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    // Function to load messages for a conversation
    const loadMessages = async (conversationId, userId) => {
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

            let messages = response.data;
            messages.sort((a, b) => new Date(a.date) - new Date(b.date));
            setMessages(messages);
        } catch (error) {
            console.error('Failed to load messages', error);
        }
    };


    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {conversations.map((conversation) => (
                    <ListItem
                        button
                        key={conversation.conversationId}
                        selected={conversation.conversationId === currentConversationId}
                        onClick={() => {
                            setCurrentConversationId(conversation.conversationId);
                            loadMessages(conversation.conversationId, userData.id); // Include userId
                            if (isMobile) {
                                setMobileOpen(false);
                            }
                        }}
                    >
                        <ListItemText primary={`Conversation ${conversation.conversationId}`} />
                    </ListItem>

                ))}
            </List>
        </Box>
    );

    // Fetches the user's information from the server
    const fetchUser = async (token) => {
        try {
            let email = '';

            // Extract user email (subject) from the token
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

            // Return the response object containing the user data
            return response;
        } catch (error) {
            console.error('Failed to fetch user', error);
            throw error;
        }
    };

    // Function to fill the drawer with conversations
    const fillDrawer = async (userId) => {
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

            setConversations(response.data);
            setCurrentConversationId(response.data[0]?.conversationId || null);

            // Load messages for the first conversation
            if (response.data.length > 0) {
                await loadMessages(response.data[0].conversationId);
            }
        } catch (error) {
            console.error('Failed to get conversations', error);
        }
    };

    // Add the startup function
    // Add the startup function
    const startup = async () => {
        console.log('Messages component has loaded.');

        try {
            // Fetch user information
            const response = await fetchUser(token);
            console.log('User data:', response.data);
            setUserData(response.data);
            setUserEmail(response.data.emailAddress);

            const userId = response.data.id; // Get the userId from the response

            // Fetch conversations and load the first conversation's messages
            const conversationsResponse = await axios.post(
                `${API_URL}/api/conversation/getAllConversations`,
                null,
                {
                    params: { userId },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const conversationsData = conversationsResponse.data;
            console.log('Conversations fetched:', conversationsData);
            setConversations(conversationsData);

            // Set the first conversation as the current one and load its messages
            if (conversationsData.length > 0) {
                const firstConversationId = conversationsData[0].conversationId;
                setCurrentConversationId(firstConversationId);
                await loadMessages(firstConversationId, userId); // Load messages for the first conversation
            }
        } catch (error) {
            console.error('Error during startup:', error);
        }
    };


    // Use useEffect to call startup when the component mounts
    useEffect(() => {
        startup();
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#f0f0f0' }}>
            {/* Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="conversations"
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                }}
            >
                {/* Header */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <Menu />
                        </IconButton>
                    )}
                    <Typography variant="h5" gutterBottom>
                        {currentConversation
                            ? `Conversation ${currentConversation.conversationId}`
                            : 'Select a conversation'}
                    </Typography>
                </Box>
                <Divider />
                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, mt: 2 }}>
                    <Stack spacing={2}>
                        {messages.map((message) => (
                            <Box
                                key={message.messageId} // Use messageId as key
                                sx={{
                                    display: 'flex',
                                    justifyContent:
                                        message.senderId === userData.id ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor:
                                            message.senderId === userData.id ? '#DCF8C6' : '#FFFFFF',
                                        boxShadow: 1,
                                    }}
                                >
                                    <Typography variant="body1">{message.message}</Typography>
                                    <Typography variant="caption" display="block" align="right">
                                        {new Date(message.date).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Box>
                {/* Message Input */}
                <Box sx={{ mt: 'auto' }}>
                    <form onSubmit={handleSendMessage}>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                variant="outlined"
                                placeholder="Type a message"
                                fullWidth
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                disabled={!currentConversation}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(90deg, #43cea2, #185a9d)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #185a9d, #43cea2)',
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