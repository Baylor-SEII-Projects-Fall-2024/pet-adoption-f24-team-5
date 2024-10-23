import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getSubjectFromToken } from '../utils/tokenUtils';
import { API_URL, FRONTEND_URL } from "@/constants";
import TitleBar from "@/components/TitleBar";
import { useSelector } from 'react-redux';

export default function HomePage() {
  const [firstNameLabel, setFirstNameLabel] = useState('');
  const [lastNameLabel, setLastNameLabel] = useState('');
  const [password, setPassword] = useState('');
  const [passwordLabel, setPasswordLabel] = useState('');
  const [oldPasswordLabel, setOldPasswordLabel] = useState('');
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberLabel, setPhoneNumberLabel] = useState('');
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
  const [userAge, setUserAge] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [centerName, setCenterName] = useState('');
  const [centerAddress, setCenterAddress] = useState('');
  const [centerCity, setCenterCity] = useState('');
  const [centerState, setCenterState] = useState('');
  const [centerZip, setCenterZip] = useState('');
  const [invalidZip, setInvalidZip] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const token = useSelector((state) => state.user.token);

  const updatedValuesRef = useRef({});
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
        try {
          const url = `${API_URL}/api/users/getUser?emailAddress=${email}`;
          const response = await axios.get(url, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });

          setPhoneNumberLabel(response.data.phoneNumber);
          setPhoneNumber(response.data.phoneNumber);
          updatedValuesRef.current.phoneNumber = response.data.phoneNumber;
          updatedValuesRef.current.password = response.data.password;
          updatedValuesRef.current.userType = response.data.userType;
          if (updatedValuesRef.current.userType === `CenterWorker` || updatedValuesRef.current.userType === `Owner`){
            setFirstNameLabel(response.data.firstName);
            updatedValuesRef.current.firstName = response.data.firstName;
            setLastNameLabel(response.data.lastName);
            updatedValuesRef.current.lastName = response.data.lastName;
            setUserAge(response.data.age);
          }
          else{
            setCenterName(response.data.centerName);
            setCenterAddress(response.data.centerAddress);
            setCenterCity(response.data.centerCity);
            setCenterState(response.data.centerState);
            setCenterZip(response.data.centerZip);
          }
        }
        catch (error) {
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
    updatedValuesRef.current.firstName = firstNameLabel;
  };

  const handleLastNameChange = () => {
    updatedValuesRef.current.lastName = lastNameLabel;
  }

  const handlePasswordChange = () => {
    setPassword(passwordLabel);
    updatedValuesRef.current.password = passwordLabel;
    updatedValuesRef.current.oldPassword = oldPasswordLabel;
  };

  const handlePhoneNumberChange = () => {
    const isValidPhone = /^\d{3}-\d{3}-\d{4}$/.test(phoneNumberLabel);
    if (!isValidPhone) {
      setInvalidPhoneNumber(true);
      return true;
    }
    else {
      setInvalidPhoneNumber(false);
      updatedValuesRef.current.phoneNumber = phoneNumberLabel;
      setPhoneNumber(phoneNumberLabel);
      return false;
    }
  };

  const handleAgeChange = (event) => {
    setUserAge(event.target.value);
  }

  const handleZipChange = () => {
    if (centerZip.length === 5){
      setInvalidZip(false);
      return false;
    }
    else {
      setInvalidZip(true);
      return true;
    }
  }

  const handleSave = async () => {
    handleFirstNameChange();
    handleLastNameChange();
    handlePasswordChange();
    let phoneNumber = handlePhoneNumberChange();
    let zip = handleZipChange();
    
    if ((!phoneNumber && !zip) || updatedValuesRef.current.userType != `CenterOwner`){
      const updateSuccess = await handleUserUpdate();
      if (updateSuccess === 0){
        setInvalidPassword(false);
        setIsEditing(false);
        setPasswordLabel("");
        setOldPasswordLabel("");
      }
      else{
        setInvalidPassword(true);
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleUserUpdate = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users/getUser`, {
        params: { emailAddress: userEmail },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      const currentUser = response.data;
      console.log("Got user successfully");

      const updatedUser = {
        id: currentUser.id,
        emailAddress: currentUser.emailAddress,
        password: updatedValuesRef.current.password !== null ? updatedValuesRef.current.password : password,
        phoneNumber: updatedValuesRef.current.phoneNumber !== '' ? updatedValuesRef.current.phoneNumber : phoneNumber,
        UserType: updatedValuesRef.current.userType
      }

      if (updatedValuesRef.current.userType === `Owner` || updatedValuesRef.current.userType === `CenterWorker`){
        console.log("age: " + userAge);
        updatedUser.age = userAge;
        console.log("updated age: " + updatedUser.age);
        updatedUser.firstName = updatedValuesRef.current.firstName;
        updatedUser.lastName = updatedValuesRef.current.lastName;
        if (updatedValuesRef.current.userType === `CenterWorker`){
          updatedUser.centerId = currentUser.centerId;
        }
      }
      else if (updatedValuesRef.current.userType === 'CenterOwner'){
        updatedUser.centerName = centerName;
        updatedUser.centerAddress = centerAddress;
        updatedUser.centerCity = centerCity;
        updatedUser.centerState = centerState;
        updatedUser.centerZip = centerZip;
        updatedUser.centerPetCount = currentUser.centerPetCount;
      }
  
      const url = `${API_URL}/api/users/update/${updatedValuesRef.current.userType}`
      const updatedResponse = await axios.put(url, updatedUser, {
        params: { oldPassword: updatedValuesRef.current.oldPassword},

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (updatedResponse.status !== 200) {
        return 1;
      }
      
      //Add alert feature somehow to show that data was successfully inserted
      console.log('User updated successfully', updatedResponse.data);

      return 0;
  
    } catch (error) {
      console.error('Failed to update user', error);
      return 1;
    }
  };

  return (
    <>
      <Head>
        <title>Settings Page</title>
      </Head>

      <TitleBar />

      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600, height: 80 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Settings</Typography>
            </CardContent>
          </Card>
          {updatedValuesRef.current.userType != 'CenterOwner' && <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>First Name</Typography>
              <TextField
                label="First Name"
                align='center'
                value={firstNameLabel}
                onChange={(e) => setFirstNameLabel(e.target.value)}
                InputProps={{
                  style: { height: '40px', width: '470px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
          </Paper>}
          {updatedValuesRef.current.userType != 'CenterOwner' && <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Last Name</Typography>
              <TextField
                label="Last Name"
                align='center'
                value={lastNameLabel}
                onChange={(e) => setLastNameLabel(e.target.value)}
                InputProps={{
                  style: { height: '40px', width: '470px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
          </Paper>}
          <Paper sx={{ width: 600, height: invalidPhoneNumber ? 70 : 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Phone Number</Typography>
              <TextField
                label="Phone Number"
                align='center'
                value={phoneNumberLabel}
                onChange={(e) => setPhoneNumberLabel(e.target.value)}
                InputProps={{
                  style: { height: '40px', width: '425px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
            {invalidPhoneNumber && (
                <Typography color="error" variant="body2">
                  Please enter a valid phone number.
                </Typography>
              )}
          </Paper>
          <Paper sx={{ width: 600, height: invalidPassword ? 120 : 90 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5' width={160}>Old Password</Typography>
              <TextField
                label="Old Password"
                align='center'
                value={oldPasswordLabel}
                onChange={(e) => setOldPasswordLabel(e.target.value)}
                InputProps={{ 
                  style: { height: '40px', width: '425px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>New Password</Typography>
              <TextField
                label="New Password"
                align='center'
                value={passwordLabel}
                onChange={(e) => setPasswordLabel(e.target.value)}
                InputProps={{
                  style: { height: '40px', width: '425px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
            {invalidPassword && (
              <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                Please enter a valid password.
              </Typography>
            )}
          </Paper>
          {updatedValuesRef.current.userType != `CenterOwner` && <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
            <Typography variant='h5'>Age</Typography>
            <Select
              labelId="age-label"
              id="age-select"
              value={userAge}
              onChange={handleAgeChange}
              label="Age"
              style={{ height: '40px', width: '545px', pointerEvents: !isEditing ? 'none' : 'auto' }}
            >
              {Array.from({ length: 101 }, (_, age) => (
              <MenuItem key={age} value={age}>
                {age}
              </MenuItem>
            ))}
            </Select>
            </Stack>
          </Paper>}
          {updatedValuesRef.current.userType == `CenterOwner` && 
          <>
          <Paper sx={{ width: 600, height: 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Center Name</Typography>
              <TextField
                label="Center Name"
                align='center'
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                InputProps={{
                  style: { height: '40px', width: '440px' },
                  readOnly: !isEditing
                }}
              />
            </Stack>
          </Paper>
          <Paper sx={{ width: 600, height: 50 }} elevation={4}>
          <Stack spacing={1} direction="row" alignItems='center'>
            <Typography variant='h5'>Center Address</Typography>
            <TextField
              label="Center Address"
              align='center'
              value={centerAddress}
              onChange={(e) => setCenterAddress(e.target.value)}
              InputProps={{
                style: { height: '40px', width: '420px' },
                readOnly: !isEditing
              }}
            />
          </Stack>
        </Paper>
        <Paper sx={{ width: 600, height: 50 }} elevation={4}>
          <Stack spacing={1} direction="row" alignItems='center'>
            <Typography variant='h5'>Center City</Typography>
            <TextField
              label="Center City"
              align='center'
              value={centerCity}
              onChange={(e) => setCenterCity(e.target.value)}
              InputProps={{
                style: { height: '40px', width: '465px' },
                readOnly: !isEditing
              }}
            />
          </Stack>
        </Paper>
        <Paper sx={{ width: 600, height: 50 }} elevation={4}>
          <Stack spacing={1} direction="row" alignItems='center'>
            <Typography variant='h5'>Center State</Typography>
            <TextField
              label="Center State"
              align='center'
              value={centerState}
              onChange={(e) => setCenterState(e.target.value)}
              InputProps={{
                style: { height: '40px', width: '450px' },
                readOnly: !isEditing
              }}
            />
          </Stack>
        </Paper>
        <Paper sx={{ width: 600, height: !invalidZip ? 50 : 70 }} elevation={4}>
          <Stack spacing={1} direction="row" alignItems='center'>
            <Typography variant='h5'>Center Zip</Typography>
            <TextField
              label="Center Zip"
              align='center'
              value={centerZip}
              onChange={(e) => setCenterZip(e.target.value)}
              InputProps={{
                style: { height: '40px', width: '470px' },
                readOnly: !isEditing
              }}
            />
          </Stack>
          {invalidZip && (
                <Typography color="error" variant="body2">
                  Please enter a valid zip code.
                </Typography>
              )}
        </Paper>
        </>
          }
          <Button onClick={isEditing ? handleSave : handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
        </Stack>
      </main>
    </>
  );
}