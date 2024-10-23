import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography, Paper } from '@mui/material';
import TitleBar from '@/components/TitleBar';
import axios from 'axios';
import { API_URL } from '@/constants';
import { useSelector } from 'react-redux';
import { getSubjectFromToken } from '@/utils/tokenUtils';


const PreferencesPage = () => {
    const [preferences, setPreferences] = useState({
        preferredSpecies: '',
        preferredBreed: '',
        preferredColor: '',
        preferredAge: '',
    });
    const [preferenceObject, setPreferenceObject] = useState(null);
    const [user, setUser] = useState(null);

    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const fetchPreferenceId = async () => {
            const email = getSubjectFromToken(token);
            if (email) {
                try {
                    const response = await axios.get(`${API_URL}/api/users/getUser`, {
                        params: { emailAddress: email },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    setUser(response.data);
                    const fetchedPreferenceId = response.data.preference;
                    if (fetchedPreferenceId) {
                        setPreferenceObject(fetchedPreferenceId);
                    }
                } catch (error) {
                    console.error('Error fetching preference ID:', error);
                }
            }
        };
        fetchPreferenceId();
    }, [token]);

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!preferenceObject) return; // Ensure preferenceId is available
            try {
                const response = await axios.get(`${API_URL}/api/preferences/get`, {
                    params: {
                        preferenceId: preferenceObject.preferenceId,
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data) {
                    setPreferences(response.data); // Prepopulate fields with existing preferences
                }
            } catch (error) {
                console.error('Error fetching preferences:', error);
            }
        };

        fetchPreferences();
    }, [preferenceObject, token]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPreferences({
            ...preferences,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (preferenceObject == null) {
            try {
                // Create a new preference if none exists
                const createResponse = await axios.post(`${API_URL}/api/preferences/create`, preferences, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setPreferenceObject(createResponse.data);
                try {
                    user.preference = createResponse.data.preferenceId;
                    const updatedUser = {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        emailAddress: user.emailAddress,
                        UserType: user.UserType,
                        password: user.password,
                        age: user.age,
                        phoneNumber: user.phoneNumber,
                        preference: createResponse.data,
                        centerZip: user.centerZip,
                    };
                    console.log("updatedUser: ", updatedUser);
                    const updateUserResponse = await axios.put(`${API_URL}/api/users/update/Owner/preferenceId`, updatedUser, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (updateUserResponse.status === 200) {
                        alert('User updated with new preference ID successfully!');
                    }
                } catch (error) {
                    console.error('Error updating user with new preference ID:', error);
                    alert('Failed to update user with new preference ID.');
                }
            } catch (error) {
                console.error('Error creating preference:', error);
                alert('Failed to create preference.');
                return;
            }
        }
        else {
            console.log('Updating existing preference');
            try {
                const response = await axios.put(`${API_URL}/api/preferences/update`, preferences, {
                    params: {
                        preferenceId: preferenceObject.preferenceId,
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(response.data);
                if (response.status === 200) {
                    alert('Preferences updated successfully!');
                }
            } catch (error) {
                console.error('Error updating preferences:', error);
                alert('Failed to update preferences.');
            }
        }


    };

    return (
        <div>
            <TitleBar />
            <main>
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={2}>
                    <Paper sx={{ width: 600, padding: 4 }} elevation={4}>
                        <Typography variant='h4' align='center'>User Preferences</Typography>
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Preferred Species"
                                    name="preferredSpecies"
                                    value={preferences.preferredSpecies}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Preferred Breed"
                                    name="preferredBreed"
                                    value={preferences.preferredBreed}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Preferred Color"
                                    name="preferredColor"
                                    value={preferences.preferredColor}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Preferred Age"
                                    name="preferredAge"
                                    type="number"
                                    value={preferences.preferredAge}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <Button type="submit" variant="contained" color="primary">
                                    Save Preferences
                                </Button>
                            </Stack>
                        </form>
                    </Paper>
                </Stack>
            </main>
        </div>
    );
};

export default PreferencesPage;
