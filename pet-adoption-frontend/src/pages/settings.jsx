import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSubjectFromToken } from '../utils/tokenUtils';
import {API_URL, FRONTEND_URL} from "@/constants";

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
  const [userEmail, setUserEmail] = useState('');
  const token = localStorage.getItem('token');


  const updatedValuesRef = useRef({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let email = '';
      // Extract user email (subject) from the token
      if (token) { 
        const subject = getSubjectFromToken(token); // Use the provided function
        if (subject) {
            setUserEmail(subject); // Store the user email (subject)
            email = subject;
        }
      }

      const fetchUserInfo = async () => {
        try{
          console.log("Email: " + email);
          const url = `${API_URL}/api/users/getUser?emailAddress=${email}`;
          const response = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          setUserId(response.data.id);
          setFirstNameLabel(response.data.firstName);
          updatedValuesRef.current.firstName = response.data.firstName;
          setLastNameLabel(response.data.lastName);
          updatedValuesRef.current.lastName = response.data.lastName;
          setPhoneNumberLabel(response.data.phoneNumber);
          setPhoneNumber(response.data.phoneNumber);
          updatedValuesRef.current.phoneNumber = response.data.phoneNumber;
          console.log("Phone number should be: " + response.data.phoneNumber);
          setOldPassword(response.data.password);
          updatedValuesRef.current.password = response.data.password;
          console.log("Old password: " + response.data.password);
          /*setUserType(userInfo.userType);
          if (userInfo.userType !== "CenterOwner") {
            setUserAge(userInfo.userAge);
          }*/
        }
        catch (error){
          console.error('Failed to fetch user', error);
        }
      };

      fetchUserInfo();
    } 
    catch (error) {
      console.error('Error fetching user info:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired, please log in again.');
        navigate('/login');
      }
    }
  }, [token]);
  
  const handleFirstNameChange = () => {
    setFirstName(firstNameLabel);
    updatedValuesRef.current.firstName = firstNameLabel;
    handleUserUpdate();
  };

  const handleLastNameChange = () => {
    setLastName(lastNameLabel);
    updatedValuesRef.current.lastName = lastNameLabel;
    handleUserUpdate();
  }

  const handlePasswordChange = () => {
    // Getting rid of for now, should work but need to bypass password decryption
    /*if (oldPassword === oldPasswordLabel){
      console.log("Making it inside");
      setPassword(passwordLabel);
      setOldPassword(passwordLabel);
      updatedValuesRef.current.password = passwordLabel;
      setOldPasswordLabel("");
      handleUserUpdate();
    }
    else{
      setInvalidPassword(true);
    }*/
    setPassword(passwordLabel);
    updatedValuesRef.current.password = passwordLabel;
    setPasswordLabel("");
    handleUserUpdate();
  };

  const handlePhoneNumberChange = () => {
    const isValidPhone = /^\d{3}-\d{3}-\d{4}$/.test(phoneNumberLabel);
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

  /*const handleAgeChange = (event) => {
    setUserAge(event.target.value);
    updatedValuesRef.current.userAge = event.target.value;
    handleUserUpdate();
  };*/

  const handleUserUpdate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/getUser`, {
        params: {emailAddress: userEmail},
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log("Fetched user: " + JSON.stringify(response.data));
  
      const currentUser = response.data;

      const updatedUser = {
        id: currentUser.id,
        firstName: updatedValuesRef.current.firstName,
        lastName: updatedValuesRef.current.lastName,
        emailAddress: currentUser.emailAddress,
        password: updatedValuesRef.current.password !== null ? updatedValuesRef.current.password : password,
        //userType: currentUser.userType,
        phoneNumber: updatedValuesRef.current.phoneNumber !== '' ? updatedValuesRef.current.phoneNumber : phoneNumber
      }
      const updatedUserJson = JSON.stringify(updatedUser, null, 2);
      console.log(updatedUserJson);

      console.log("Id: " + userId);
      console.log(JSON.stringify(updatedUser));
  
      const updatedResponse = await axios.put(`${API_URL}/api/users/update/User/${userId}`, updatedUser, {
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
          <Paper sx={{ width: 600, height: 80 }} elevation={4}>
            {/*<Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5' width={160}>Old Password</Typography>
              <TextField
                label="Old Password"
                align='center'
                value={oldPasswordLabel}
                onChange={(e) => setOldPasswordLabel(e.target.value)}
                InputProps={{ style: { height: '40px', width: '420px' } }}
              />
            </Stack>*/}
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
          {/*userType != "CenterOwner" && (<Paper sx={{ width: 600 }} elevation={4}>
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
          </Paper>)*/}
        </Stack>
      </main>
    </>
  );
}