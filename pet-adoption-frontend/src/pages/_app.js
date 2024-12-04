import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Provider as ReduxProvider } from 'react-redux';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { CssBaseline } from '@mui/material';
import { PetAdoptionThemeProvider } from '@/styles/theme';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '@/utils/redux/redux';

import '@/styles/globals.css';
import '@/styles/styled-button.css';

import AppRoutes from "@/routing/routes";


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