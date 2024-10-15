import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
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
const reduxStore = buildStore({});

function AppRoutes() {
  const token = useSelector((state) => state.user.token);

  return (
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
  );
}

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ReduxProvider store={reduxStore}>
      <AppCacheProvider>
        <Head>
          <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
          <link rel='icon' href='/favicon.ico' />
        </Head>

        <PetAdoptionThemeProvider>
          <CssBaseline />
          {isClient && <AppRoutes />}
        </PetAdoptionThemeProvider>
      </AppCacheProvider>
    </ReduxProvider>
  );
}