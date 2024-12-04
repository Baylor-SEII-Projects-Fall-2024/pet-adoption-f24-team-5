import React from 'react';
import TitleBar from './titleBar/TitleBar';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <Box sx={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
            <TitleBar />
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
