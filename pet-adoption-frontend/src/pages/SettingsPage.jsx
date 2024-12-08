import React, { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { Button, Card, CardContent, Stack, TextField, Typography, Paper, Container, Box, Grid } from '@mui/material';
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

  const [_, setForceUpdate] = useState(0);

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
    setForceUpdate(prev => prev + 1);
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
    <Container
      maxWidth="xl"
      sx={{
        py: 3,
        px: 2,
        height: '92vh', // Account for navbar height
        overflow: 'auto'
      }}
    >
      {/* Title Section */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 500
          }}
        >
          Settings
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Manage your account information
        </Typography>
      </Box>

      {/* Form Container */}
      <Box
        sx={{
          maxWidth: '600px',
          mx: 'auto',
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1,
          p: 3
        }}
      >
        <Stack spacing={2.5}>
          {updatedValuesRef.current.userType !== 'CenterOwner' && (
            <>
              <TextField
                fullWidth
                label="First Name"
                value={updatedValuesRef.current.firstName || ''}
                onChange={(e) => {
                  updatedValuesRef.current.firstName = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                disabled={!isEditing}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={updatedValuesRef.current.lastName || ''}
                onChange={(e) => {
                  updatedValuesRef.current.lastName = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                disabled={!isEditing}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}

          <TextField
            fullWidth
            label="Phone Number"
            value={updatedValuesRef.current.phoneNumber || ''}
            onChange={handlePhoneNumberChange}
            disabled={!isEditing}
            error={invalidPhoneNumber}
            helperText={invalidPhoneNumber ? "Please enter a valid phone number" : ""}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {isEditing && (
            <>
              <TextField
                fullWidth
                label="Old Password"
                type="password"
                value={updatedValuesRef.current.oldPassword}
                onChange={(e) => {
                  updatedValuesRef.current.oldPassword = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={updatedValuesRef.current.password}
                onChange={(e) => {
                  updatedValuesRef.current.password = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                error={invalidPassword}
                helperText={invalidPassword ? "Please enter a valid password" : ""}
                variant="outlined"
              />
            </>
          )}

          {updatedValuesRef.current.userType !== 'CenterOwner' && (
            <TextField
              fullWidth
              label="Age"
              type="number"
              value={updatedValuesRef.current.age || ''}
              onChange={handleAgeChange}
              disabled={!isEditing}
              error={invalidAge}
              helperText={invalidAge ? "Please enter a valid age" : ""}
              InputProps={{
                inputProps: { min: 0, max: 100 }
              }}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          {updatedValuesRef.current.userType === 'CenterOwner' && (
            <>
              <TextField
                fullWidth
                label="Center Name"
                value={updatedValuesRef.current.centerName}
                onChange={(e) => {
                  updatedValuesRef.current.centerName = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                disabled={!isEditing}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Center Address"
                value={updatedValuesRef.current.centerAddress}
                onChange={(e) => {
                  updatedValuesRef.current.centerAddress = e.target.value;
                  setForceUpdate(prev => prev + 1);
                }}
                disabled={!isEditing}
                variant="outlined"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Center City"
                    value={updatedValuesRef.current.centerCity}
                    onChange={(e) => {
                      updatedValuesRef.current.centerCity = e.target.value;
                      setForceUpdate(prev => prev + 1);
                    }}
                    disabled={!isEditing}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Center State"
                    value={updatedValuesRef.current.centerState}
                    onChange={(e) => {
                      updatedValuesRef.current.centerState = e.target.value;
                      setForceUpdate(prev => prev + 1);
                    }}
                    disabled={!isEditing}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </>
          )}

          <TextField
            fullWidth
            label="Center Zip"
            value={updatedValuesRef.current.centerZip || ''}
            onChange={handleZipChange}
            disabled={!isEditing}
            error={invalidZip}
            helperText={invalidZip ? "Please enter a valid zip code" : ""}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Action Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={isEditing ? handleSave : handleEdit}
            sx={{
              mt: 2,
              py: 1,
              width: '100%'
            }}
          >
            {isEditing ? 'Save Changes' : 'Edit'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
