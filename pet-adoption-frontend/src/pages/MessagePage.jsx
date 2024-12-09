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

        // Convert pet data to JSON string and prepend the prefix
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
            scrollToBottom();
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

            // Only set currentConversationId if it hasn't been set yet
            setCurrentConversationId((prevId) => prevId || updatedConversations[0]?.conversationId || null);

            // Load messages for the first conversation if none selected
            if (!currentConversationId && updatedConversations.length > 0) {
                await loadMessages(updatedConversations[0].conversationId, userId);
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
            const userData = response.data; // Store the fetched user data in a local variable

            setUserData(userData); // Set the userData state
            setUserEmail(userData.emailAddress);

            const userId = userData.id; // Get the userId from the response
            const userType = userData.userType;

            // Ensure `userData` is fully set before proceeding
            setTimeout(async () => {
                // Fetch conversations and load the first conversation's messages
                await fillDrawer(userId, userType);
            }, 0);
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
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', backgroundColor: '#f0f0f0' }}>
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
                            top: '64px', // Offset to prevent overlapping the AppBar
                            height: 'calc(100% - 64px)',
                        },
                    }}
                >
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            {conversations.map((conversation) => (
                                <ListItem
                                    button
                                    key={conversation.conversationId}
                                    selected={conversation.conversationId === currentConversationId}
                                    onClick={() => {
                                        setCurrentConversationId(conversation.conversationId);
                                        setIsNewConversation(true); // Mark this as a new conversation
                                        loadMessages(conversation.conversationId, userData.id);
                                        if (isMobile) {
                                            setMobileOpen(false);
                                        }
                                    }}

                                >
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography>
                                                    {conversation.otherUserName || `Conversation ${conversation.conversationId}`}
                                                </Typography>
                                                {conversation.unreadMessagesOwner > 0 || conversation.unreadMessagesCenter > 0 ? (
                                                    <Badge
                                                        badgeContent={
                                                            userData.userType === 'Owner'
                                                                ? conversation.unreadMessagesOwner
                                                                : conversation.unreadMessagesCenter
                                                        }
                                                        color="error"
                                                    />
                                                ) : null}
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
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
                    height: 'calc(100vh - 64px)', // Adjusted height
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
                        {currentConversation?.otherUserName || 'Select a conversation'}
                    </Typography>
                </Box>
                <Divider />
                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, mt: 2, height: 'auto',}}>
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
                                            }}
                                        >
                                            <Typography color="error">Invalid pet data received.</Typography>
                                        </Box>
                                    );
                                }

                                return (
                                    <Box
                                        key={message.messageId}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: isCurrentUserSender ? 'flex-end' : 'flex-start',
                                            height: 'fit-content',
                                            overflow: 'visible',
                                        }}
                                    >
                                        {/* Render the PetCard component */}
                                        <Box
                                            sx={{
                                                width: '100%',
                                                maxWidth: '400px',
                                                overflow: 'visible',
                                                height: 'fit-content',
                                            }}
                                        >
                                            <PetCard
                                                pet={petData}
                                                expandable={true} // Set as needed
                                                saveable={true} // Set as needed
                                                likeable={true} // Set as needed
                                                contactable={false}
                                                size="Large"
                                            />
                                            <Typography variant="caption" display="block" align="right">
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
                                                p: 1,
                                                borderRadius: 2,
                                                backgroundColor: isCurrentUserSender ? '#DCF8C6' : '#FFFFFF',
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
                                );
                            }
                        })}
                        {/* Dummy div to scroll into view */}
                        <div ref={messagesEndRef} />
                    </Stack>
                </Box>
                {/* Message Input */}

                {/* Add this button within your JSX, perhaps near the message input
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSendPetCardMessage(examplePetData)}
                        disabled={!currentConversation}
                    >
                        Send PetCard
                    </Button>*/}


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