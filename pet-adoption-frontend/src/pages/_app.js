import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PetAdoptionThemeProvider } from '@/utils/theme';
import { buildStore } from '@/utils/redux';
import '@/styles/globals.css';
import '@/styles/styled-button.css';

// Dynamically import BrowserRouter to ensure it only runs on the client side
const BrowserRouter = dynamic(
    () => import('react-router-dom').then((mod) => mod.BrowserRouter),
    { ssr: false }
);

import HomePage from './home';
import Register from './Register';
import Login from './Login';
import PostPet from './PostPet';
import SearchEngine from './SearchEngine';
import Settings from './settings';
import LocalAdoptionCenter from './LocalAdoptionCenter';

// Initialize Redux
let initialState = {};
let reduxStore = buildStore(initialState);

export default function App() {
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state to prevent premature render

    // Set token only once after the component mounts and delay setting the loading to false
    useEffect(() => {
        const storedToken = localStorage.getItem('token');

        // Simulate a small delay to ensure proper rendering and token verification
        setTimeout(() => {
            setToken(storedToken);
            setIsLoading(false); // Stop loading when token is retrieved
            console.log("Token from localStorage:", storedToken);
        }, 100); // Adjust this delay if needed (100 milliseconds in this example)

    }, []);

    // If still loading, render a loading spinner or empty div
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <ReduxProvider store={reduxStore}>
            <AppCacheProvider>
                <Head>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
                    <link rel='icon' href='/favicon.ico' />
                </Head>

                <PetAdoptionThemeProvider>
                    <CssBaseline />
                    <BrowserRouter>
                        {token ? (
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/Register" element={<Register />} />
                                <Route path="/Login" element={<Login />} />
                                <Route path="/PostPet" element={<PostPet />} />
                                <Route path="/SearchEngine" element={<SearchEngine />} />
                                <Route path="/Settings" element={<Settings />} />
                                <Route path="/LocalAdoptionCenter" element={<LocalAdoptionCenter />} />
                            </Routes>
                        ) : (
                            <Routes>
                                <Route path="/Register" element={<Register />} />
                                <Route path="/Login" element={<Login />} />
                                <Route path="*" element={<Navigate to="/Login" />} />
                            </Routes>
                        )}
                    </BrowserRouter>
                </PetAdoptionThemeProvider>
            </AppCacheProvider>
        </ReduxProvider>
    );
}
