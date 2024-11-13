import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PetAdoptionThemeProvider } from '@/utils/theme';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/utils/redux';
import SavedPets from './SavedPets';

import '@/styles/globals.css';
import '@/styles/styled-button.css';

const BrowserRouter = dynamic(
  () => import('react-router-dom').then((mod) => mod.BrowserRouter),
  { ssr: false }
);

import HomePage from './home';
import Register from './Register';
import Login from './Login';
import PetManager from './PetManager';
import SearchEngine from './SearchEngine';
import Settings from './settings';
import LocalAdoptionCenter from './LocalAdoptionCenter';
import EventManager from "@/pages/EventManager";
import PreferencesPage from "@/pages/preferences";
import Messages from "@/pages/Messages";

import ProtectedRoute from './protectedRoute';
import AvailablePets from "@/pages/AvailablePets";
import ManageAccounts from "@/pages/ManageAccounts";
import RegisterCenterWorker from "@/pages/RegisterCenterWorker";

import Layout from '@/components/Layout';
import SessionExpired from "@/pages/SessionExpired";

function AppRoutes() {
  const token = useSelector((state) => state.user.token);

  return (
    <BrowserRouter>
      <Routes>
                <Route path="/PetManager" element={<ProtectedRoute><PetManager /></ProtectedRoute>} />
          <Route path="/EventManager" element={<ProtectedRoute><EventManager /></ProtectedRoute>} />
          <Route path="/SearchEngine" element={<ProtectedRoute><SearchEngine /></ProtectedRoute>} />
          <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/LocalAdoptionCenter" element={<ProtectedRoute><LocalAdoptionCenter /></ProtectedRoute>} />
          <Route path="/ManageAccounts" element={<ProtectedRoute><ManageAccounts /></ProtectedRoute>} />
          <Route path="/RegisterCenterWorker" element={<ProtectedRoute><RegisterCenterWorker /></ProtectedRoute>} />
          <Route path="/AvailablePets" element={<ProtectedRoute><AvailablePets /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><PreferencesPage /></ProtectedRoute>} />
          <Route path="/SavedPets" element={<ProtectedRoute><SavedPets /></ProtectedRoute>} />
          <Route path="/Messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/session-expired" element={<SessionExpired />} />

        <Route path="*" element={<Navigate to="/Login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </ReduxProvider>
  );
}