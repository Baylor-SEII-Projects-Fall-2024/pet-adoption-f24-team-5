import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { handleUpdateUser } from '../utils/user/updateUser';
import { getUser } from '../utils/user/getUser';
import { getSubjectFromToken } from '../utils/redux/tokenUtils';
export default function SettingsPage() {
  const token = useSelector((state) => state.user.token);
  const email = getSubjectFromToken(token);
  const [currentUser, setUser] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const updatedValuesRef = useRef({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    phoneNumber: currentUser.phoneNumber,
    password: "",
    oldPassword: "",
    age: currentUser.age,
    userType: currentUser.userType,
    centerName: currentUser.centerName,
    centerAddress: currentUser.centerAddress,
    centerCity: currentUser.centerCity,
    centerState: currentUser.centerState,
    centerZip: currentUser.centerZip,
  });

  const [invalidAge, setInvalidAge] = useState(false);
  const [invalidZip, setInvalidZip] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [invalidPhoneNumber, setInvalidPhoneNumber] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser(token, email);
      setUser(userData);
      const { password, oldPassword, ...userWithoutPasswords } = userData;
      updatedValuesRef.current = userWithoutPasswords;
    };
    fetchUser();
  }, [token, email]);

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); // Remove non-digit characters
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); // Match groups of numbers

    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-'); // Join with '-' separator
    }
    return value;
  };

  const handlePhoneNumberChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    if (formattedPhoneNumber.length == 12) {
      setInvalidPhoneNumber(false);
    }
    else {
      setInvalidPhoneNumber(true);
    }
    updatedValuesRef.current.phoneNumber = formattedPhoneNumber;
  };

  const handleAgeChange = (event) => {
    if (event.target.value <= 100 && event.target.value > 0) {
      updatedValuesRef.current.age = event.target.value;
      setInvalidAge(false);
    }
    else {
      setInvalidAge(true);
    }
  }

  const handleZipChange = () => {
    if (updatedValuesRef.current.centerZip.length === 5) {
      setInvalidZip(false);
    } else {
      setInvalidZip(true);
    }
  }

  const handleSave = async () => {
    if (!invalidPhoneNumber && !invalidAge && !invalidZip) {
      const updateSuccess = await handleUpdateUser(updatedValuesRef, token, dispatch, email);
      if (updateSuccess === 0) {
        setInvalidPassword(false);
        setIsEditing(false);
        setInvalidZip(false); // Reset zip validation
      } else {
        setInvalidPassword(true);
      }
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  return (
    <>
      <Head>
        <title>Settings Page</title>
      </Head>
      <main>
        <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
          <Card sx={{ width: 600, height: 80 }} elevation={4}>
            <CardContent>
              <Typography variant='h3' align='center'>Settings</Typography>
            </CardContent>
          </Card>
          {updatedValuesRef.current.userType !== 'CenterOwner' && (
            <>
              <Paper sx={{ width: 600, height: 50 }} elevation={4}>
                <Stack spacing={1} direction="row" alignItems='center'>
                  <Typography variant='h5'>First Name</Typography>
                  <TextField
                    label="First Name"
                    align='center'
                    value={updatedValuesRef.current.firstName}
                    onChange={(e) => {
                      updatedValuesRef.current.firstName = e.target.value;
                      forceUpdate({});
                    }}
                    InputProps={{
                      style: { height: '40px', width: '470px' },
                      readOnly: !isEditing
                    }}
                  />
                </Stack>
              </Paper>
              <Paper sx={{ width: 600, height: 50 }} elevation={4}>
                <Stack spacing={1} direction="row" alignItems='center'>
                  <Typography variant='h5'>Last Name</Typography>
                  <TextField
                    label="Last Name"
                    align='center'
                    value={updatedValuesRef.current.lastName}
                    onChange={(e) => {
                      updatedValuesRef.current.lastName = e.target.value;
                      forceUpdate({});
                    }}
                    InputProps={{
                      style: { height: '40px', width: '470px' },
                      readOnly: !isEditing
                    }}
                  />
                </Stack>
              </Paper>
            </>
          )}
          <Paper sx={{ width: 600, height: invalidPhoneNumber ? 70 : 50 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Phone Number</Typography>
              <TextField
                label="Phone Number"
                align='center'
                value={updatedValuesRef.current.phoneNumber}
                onChange={(e) => { handlePhoneNumberChange(e) }}
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
                value={updatedValuesRef.current.oldPassword}
                onChange={(e) => {
                  updatedValuesRef.current.oldPassword = e.target.value;
                  forceUpdate({});
                }}
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
                value={updatedValuesRef.current.password}
                onChange={(e) => {
                  updatedValuesRef.current.password = e.target.value;
                  forceUpdate({});
                }}
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
          {updatedValuesRef.current.userType !== 'CenterOwner' && (
            <Paper sx={{ width: 600, height: invalidAge ? 70 : 50 }} elevation={4}>
              <Stack spacing={1} direction="row" alignItems='center'>
                <Typography variant='h5'>Age</Typography>
                <TextField
                  id="age-input"
                  type="number"
                  value={updatedValuesRef.current.age}
                  onChange={(e) => { handleAgeChange(e) }}
                  inputProps={{
                    min: 0,
                    max: 100,
                    style: { height: '8px' }
                  }}
                  sx={{ width: '545px' }}
                />
              </Stack>
              {invalidAge && (
                <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                  Please enter a valid age.
                </Typography>
              )}
            </Paper>
          )}
          {updatedValuesRef.current.userType === 'CenterOwner' && (
            <>
              <Paper sx={{ width: 600, height: 50 }} elevation={4}>
                <Stack spacing={1} direction="row" alignItems='center'>
                  <Typography variant='h5'>Center Name</Typography>
                  <TextField
                    label="Center Name"
                    align='center'
                    value={updatedValuesRef.current.centerName}
                    onChange={(e) => {
                      updatedValuesRef.current.centerName = e.target.value;
                      forceUpdate({});
                    }}
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
                    value={updatedValuesRef.current.centerAddress}
                    onChange={(e) => {
                      updatedValuesRef.current.centerAddress = e.target.value;
                      forceUpdate({});
                    }}
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
                    value={updatedValuesRef.current.centerCity}
                    onChange={(e) => {
                      updatedValuesRef.current.centerCity = e.target.value;
                      forceUpdate({});
                    }}
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
                    value={updatedValuesRef.current.centerState}
                    onChange={(e) => {
                      updatedValuesRef.current.centerState = e.target.value;
                      forceUpdate({});
                    }}
                    InputProps={{
                      style: { height: '40px', width: '450px' },
                      readOnly: !isEditing
                    }}
                  />
                </Stack>
              </Paper>
            </>
          )}

          <Paper sx={{ width: 600, height: !invalidZip ? 50 : 70 }} elevation={4}>
            <Stack spacing={1} direction="row" alignItems='center'>
              <Typography variant='h5'>Center Zip</Typography>
              <TextField
                label="Center Zip"
                align='center'
                value={updatedValuesRef.current.centerZip}  // Bind the current centerZip value here
                onChange={(e) => { handleZipChange(e) }}  // Allow user to change zip
                InputProps={{
                  style: { height: '40px', width: '470px' },
                  readOnly: !isEditing,  // Read-only until the user clicks Edit
                }}
              />
            </Stack>
            {invalidZip && (
              <Typography color="error" variant="body2">
                Please enter a valid zip code.
              </Typography>
            )}
          </Paper>

          <Button onClick={isEditing ? handleSave : handleEdit}>{isEditing ? 'Save' : 'Edit'}</Button>
        </Stack>
      </main>
    </>
  );
}
