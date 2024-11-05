import React, { useState } from 'react';
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

const Messages = () => {
    const tempConversations = [
        {
            id: 1,
            name: 'John Doe',
            messages: [
                { id: 1, sender: 'John Doe', text: 'Hey, how are you?', timestamp: '10:00 AM' },
                { id: 2, sender: 'Me', text: 'I am good, thanks!', timestamp: '10:01 AM' },
            ],
        },
        {
            id: 2,
            name: 'Jane Smith',
            messages: [
                { id: 1, sender: 'Jane Smith', text: 'Are we still on for lunch?', timestamp: '9:00 AM' },
                { id: 2, sender: 'Me', text: 'Yes, see you at noon!', timestamp: '9:05 AM' },
            ],
        },
    ];

    const [conversations, setConversations] = useState(tempConversations);
    const [currentConversationId, setCurrentConversationId] = useState(1);
    const [messageInput, setMessageInput] = useState('');

    const currentConversation = conversations.find((conv) => conv.id === currentConversationId);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() === '') return;

        const newMessage = {
            id: currentConversation.messages.length + 1,
            sender: 'Me',
            text: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        // Update the conversations state
        setConversations((prevConversations) =>
            prevConversations.map((conv) =>
                conv.id === currentConversationId
                    ? { ...conv, messages: [...conv.messages, newMessage] }
                    : conv
            )
        );
        setMessageInput('');
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawerWidth = 240;

    const drawer = (
        <Box sx={{ overflow: 'auto' }}>
            <List>
                {conversations.map((conversation) => (
                    <ListItem
                        button
                        key={conversation.id}
                        selected={conversation.id === currentConversationId}
                        onClick={() => {
                            setCurrentConversationId(conversation.id);
                            if (isMobile) {
                                setMobileOpen(false);
                            }
                        }}
                    >
                        <ListItemText primary={conversation.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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
                        {currentConversation.name}
                    </Typography>
                </Box>
                <Divider />
                {/* Messages */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, mt: 2 }}>
                    <Stack spacing={2}>
                        {currentConversation.messages.map((message) => (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        p: 1,
                                        borderRadius: 2,
                                        backgroundColor: message.sender === 'Me' ? '#DCF8C6' : '#FFFFFF',
                                        boxShadow: 1,
                                    }}
                                >
                                    <Typography variant="body1">{message.text}</Typography>
                                    <Typography variant="caption" display="block" align="right">
                                        {message.timestamp}
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
