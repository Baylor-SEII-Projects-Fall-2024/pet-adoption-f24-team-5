import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper } from '@mui/material';
import styles from '@/styles/Home.module.css';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameLabel, setFirstNameLabel] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameLabel, setLastNameLabel] = useState('');
  const [password, setPassword] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordLabel, setOldPasswordLabel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberLabel, setPhoneNumberLabel] = useState('');
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);

  // Uncomment and use when ready
  /*useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data && data.username) {
          setUsername(data.username);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);*/

  const handleFirstNameChange = () => {
    setFirstName(firstNameLabel);
  };

  const handleLastNameChange = () => {
    setLastName(lastNameLabel);
  }

  const handlePasswordChange = () => {
    setPassword(passwordLabel);
    setOldPassword(passwordLabel);
    setOldPasswordLabel("");
  };

  const handlePhoneNumberChange = () => {
    if (!phoneNumberLabel.length < 9){
      setInvalidPhoneNumber(true);
    }
    else{
      setInvalidPhoneNumber(false);
    }
    setPhoneNumber(phoneNumberLabel);
  };

  return (
    <>
      <Head>
        <title>Home Page</title>
      </Head>

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600, height: 80 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Settings</Typography>
            </CardContent>
          </Card>
          <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>First Name</Typography>
              <TextField
                label="First Name"
                align='center'
                value={firstNameLabel}
                onChange={(e) => setFirstNameLabel(e.target.value)}
                InputProps={{ style: { height: '40px', width: '400px' } }}
              />
              <Button onClick={handleFirstNameChange}>Change</Button>
            </Stack>
          </Paper>
          <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Last Name</Typography>
              <TextField
                label="Last Name"
                align='center'
                value={lastNameLabel}
                onChange={(e) => setLastNameLabel(e.target.value)}
                InputProps={{ style: { height: '40px', width: '400px' } }}
              />
              <Button onClick={handleLastNameChange}>Change</Button>
            </Stack>
          </Paper>
          <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Phone Number</Typography>
              <TextField
                label="Phone Number"
                align='center'
                value={phoneNumberLabel}
                onChange={(e) => setPhoneNumberLabel(e.target.value)}
                InputProps={{ style: { height: '40px', width: '300px' } }}
              />
              {invalidPhoneNumber && (
                <Typography color="error" variant="body2">
                  Please enter a valid phone number.
                </Typography>
              )}
              <Button onClick={handlePhoneNumberChange}>Change</Button>
            </Stack>
          </Paper>
          <Paper sx={{ width: 600, height: 120 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5' width={160}>Old Password</Typography>
              <TextField
                label="Old Password"
                align='center'
                value={oldPasswordLabel}
                InputProps={{ style: { height: '40px', width: '420px' } }}
              />
            </Stack>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>New Password</Typography>
              <TextField
                label="New Password"
                align='center'
                value={passwordLabel}
                onChange={(e) => setPasswordLabel(e.target.value)}
                InputProps={{ style: { height: '40px', width: '420px' } }}
              />
            </Stack>
            <Button onClick={handlePasswordChange}>Confirm</Button>
          </Paper>
          <Stack direction="row"></Stack>
        </Stack>
      </main>
    </>
  );
}
