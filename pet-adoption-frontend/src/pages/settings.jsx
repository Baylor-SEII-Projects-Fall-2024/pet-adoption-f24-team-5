import React from 'react';
import Head from 'next/head'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import styles from '@/styles/Home.module.css'

export default function HomePage() {

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Settings</Typography>
              <Typography variant='body1' color='text.secondary'>This is the start of the settings page.</Typography>
            </CardContent>
          </Card>
          <Stack direction="row">
            {/* There are multiple ways to apply styling to Material UI components. One way is using the `sx` prop: */}
          </Stack>
        </Stack>
      </main>
    </>
  );
}
