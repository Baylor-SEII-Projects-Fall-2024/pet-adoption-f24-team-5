import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper } from '@mui/material';
import styles from '@/styles/Home.module.css';

export default function HomePage() {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameLabel, setFirstNameLabel] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameLabel, setLastNameLabel] = useState('');
  const [password, setPassword] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [oldPasswordLabel, setOldPasswordLabel] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberLabel, setPhoneNumberLabel] = useState('');
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);

  //Can add ability to change age

  const updatedValuesRef = useRef({});

  useEffect(() => {
    const storedUserId = Number(localStorage.getItem('currentId'));
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserInfo(storedUserId);
    }
  }, []);

  const fetchUserInfo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/users/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      setFirstNameLabel(userInfo.firstName);
      setLastNameLabel(userInfo.lastName);
      setPhoneNumberLabel(userInfo.phoneNumber);
      setOldPassword(userInfo.password);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleFirstNameChange = () => {
    setFirstName(firstNameLabel);
    handleUserUpdate();
  };

  const handleLastNameChange = () => {
    setLastName(lastNameLabel);
    handleUserUpdate();
  }

  const handlePasswordChange = () => {
    console.log("Old: " + oldPasswordLabel);
    console.log("New: " + passwordLabel);
    if (oldPassword == oldPasswordLabel){
      setPassword(passwordLabel);
      setOldPassword(passwordLabel);
      updatedValuesRef.current.password = passwordLabel;
      setOldPasswordLabel("");
      handleUserUpdate();
    }
    else{
      setInvalidPassword(true);
    }
  };

  const handlePhoneNumberChange = () => {
    const isValidPhone = /^[0-9]{10}$/.test(phoneNumberLabel);
    if (!isValidPhone){
      setInvalidPhoneNumber(true);
    }
    else{
      setInvalidPhoneNumber(false);
      updatedValuesRef.current.phoneNumber = phoneNumberLabel;
      setPhoneNumber(phoneNumberLabel);
      handleUserUpdate();
    }
  };

  const handleUserUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`);
      if (!response.ok){
        throw new Error("Failed to fetch user data");
      }

      const currentUser = await response.json();
      const updatedUser = {
        ...currentUser,
        password: updatedValuesRef.current.password || password,
        phoneNumber: updatedValuesRef.current.phoneNumber || phoneNumber,
      };

      const updatedResponse = await fetch (`http://localhost:8080/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    if (!updatedResponse.ok){
      throw new Error("Failed to update user data");
    }
    }
    catch (error){
      console.error('Failed to update user', error);
    }
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
                onChange={(e) => setOldPasswordLabel(e.target.value)}
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
            {invalidPassword && (
              <Typography color="error" variant = "body2" sx={{ marginTop: 1}}>
                Please enter a valid password.
              </Typography>
            )}
          </Paper>
          <Stack direction="row"></Stack>
        </Stack>
      </main>
    </>
  );
}
