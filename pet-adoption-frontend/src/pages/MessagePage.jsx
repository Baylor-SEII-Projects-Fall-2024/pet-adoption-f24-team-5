import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { API_URL } from '@/constants';
import axios from 'axios';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';
import { useSelector } from 'react-redux';
import { sendMessage } from '@/utils/message/SendMessage';
import { getMessages } from '@/utils/message/GetMessages';
import { resetOwnerUnreads } from '@/utils/message/ResetOwnerUnreads';
import { resetCenterUnreads } from '@/utils/message/ResetCenterUnreads';
import { getUser } from '@/utils/user/getUser';
import { getOtherUserName } from '@/utils/message/GetOtherUserName';
import { getAllConversations } from '@/utils/message/GetAllConversations';

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const token = useSelector((state) => state.user.token);
    const [userEmail, setUserEmail] = useState(getSubjectFromToken(token));
    const [userData, setUserData] = useState(getUser(token, userEmail));

    const messagesEndRef = useRef(null); // Reference to the end of messages

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const newMessage = await sendMessage(token, currentConversationId, userData, receiverId, messageInput);

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

    // Modified loadMessages to accept an optional parameter to control unread message reset
    const loadMessages = useCallback(async (conversationId, userId, resetUnread = true) => {
        try {
            const newMessages = await getMessages(token, conversationId, userId);

            newMessages.sort((a, b) => new Date(a.date) - new Date(b.date));
            setMessages(newMessages);

            // Reset unread messages for this conversation only if resetUnread is true
            if (resetUnread) {
                if (userData.userType === 'Owner') {
                    await resetOwnerUnreads(token, conversationId);
                } else {
                    await resetCenterUnreads(token, conversationId);
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
    }, [token, userData, setMessages, setConversations]);

    const fetchUser = async (token) => {
        try {
            const response = await getUser(token, userEmail);
            return response;
        } catch (error) {
            console.error('Failed to fetch user', error);
            throw error;
        }
    };

    const fetchOtherUserNameForConversation = async (conversationId, userType) => {
        try {
            const response = await getOtherUserName(token, userType, conversationId);

            return response;
        } catch (error) {
            console.error('Failed to fetch other user name', error);
            return `Conversation ${conversationId}`;
        }
    };

    const fillDrawer = useCallback(async (userId, userType) => {
        try {
            const conversationsData = await getAllConversations(token, userId);

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
    }, [token, currentConversationId, setConversations, setCurrentConversationId, loadMessages]);

    const startup = async () => {
        console.log('Messages component has loaded.');

        try {
            // Fetch user information
            const response = await fetchUser(token);
            setUserData(response);
            setUserEmail(response.emailAddress);

            const userId = response.id; // Get the userId from the response
            const userType = response.userType;

            // Fetch conversations and load the first conversation's messages
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
                        await loadMessages(currentConversationId, userData.id, false);
                        await fillDrawer(userData.id, userData.userType);
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
    }, [currentConversationId, userData, loadMessages, fillDrawer]);

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
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, mt: 2 }}>
                    <Stack spacing={2}>
                        {messages.map((message) => (
                            <Box
                                key={message.messageId}
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
                        {/* Dummy div to scroll into view */}
                        <div ref={messagesEndRef} />
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
