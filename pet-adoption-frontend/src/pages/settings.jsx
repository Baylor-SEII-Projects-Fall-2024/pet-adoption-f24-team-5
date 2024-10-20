import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from '../utils/userSlice'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  const [userType, setUserType] = useState('');
  const [userAge, setUserAge] = useState('');
  const token = localStorage.getItem('token');

  const updatedValuesRef = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = Number(localStorage.getItem('currentId')); // Need this to update to correct id

    if (storedToken) {
      dispatch(setToken(storedToken));
    }

    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserInfo(storedToken);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      console.log("Id: " + id);
      const response = await fetch(`http://localhost:8080/api/users/getUser`, {
        params: { id: userId },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      console.log(JSON.stringify(userInfo));
      setUserId(userInfo.id);
      setFirstNameLabel(userInfo.firstName);
      setLastNameLabel(userInfo.lastName);
      setPhoneNumberLabel(userInfo.phoneNumber);
      setOldPassword(userInfo.password);
      setUserType(userInfo.userType);
      if (userInfo.userType !== "CenterOwner") {
        setUserAge(userInfo.userAge);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired, please log in again.');
        navigate('/login');
      }
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

  const handleAgeChange = (event) => {
    setUserAge(event.target.value);
    updatedValuesRef.current.userAge = event.target.value;
    handleUserUpdate();
  };

  const handleUserUpdate = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/getUser`, {
        params: {id: userId},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log("Fetched user: " + JSON.stringify(response.data));
  
      const currentUser = response.data;
      
      /*const updatedUser = {
        ...currentUser,
        password: updatedValuesRef.current.password || password,
        phoneNumber: updatedValuesRef.current.phoneNumber || phoneNumber,
        // Maybe need to add userAge update (see below for check)
      };*/

      const updatedUser = {
        id: currentUser.id,
        emailAddress: currentUser.emailAddress,
        password: updatedValuesRef.current.password || password,
        //userType: currentUser.userType,
        phoneNumber: updatedValuesRef.current.phoneNumber || phoneNumber
      }
      const updatedUserJson = JSON.stringify(updatedUser, null, 2);
      console.log(updatedUserJson);

      console.log("Id: " + userId);
      console.log(JSON.stringify(updatedUser));
  
      /*if (updatedUser.userType !== "CenterOwner") {
        updatedUser.userAge = updatedValuesRef.current.userAge || userAge;
      }*/
  
      const updatedResponse = await axios.put(`http://localhost:8080/api/users/update/User/${userId}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
  
      if (updatedResponse.status !== 200) {
        throw new Error("Failed to update user data");
      }
      
      console.log('User updated successfully', updatedResponse.data);
  
    } catch (error) {
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
          {userType != "CenterOwner" && (<Paper sx={{ width: 600 }} elevation={4}>
            <Stack direction = "row">
              <FormControl fullWidth>
                <InputLabel id="Age">Age</InputLabel>
                <Select
                  labelId="Age"
                  value={userAge}
                  onChange={handleAgeChange}
                  displayEmpty
                >
                  {[...Array(100).keys()].map((num) => (
                    <MenuItem key={num + 1} value={num + 1}>
                      {num + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Paper>)}
        </Stack>
      </main>
    </>
  );
}