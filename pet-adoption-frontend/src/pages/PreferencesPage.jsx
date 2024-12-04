import React, { useState, useEffect } from 'react';
import { TextField, Button, Stack, Typography, Paper } from '@mui/material';
import TitleBar from '@/components/titleBar/TitleBar';
import axios from '../utils/redux/axiosConfig';
import { API_URL } from '@/constants';
import { useSelector } from 'react-redux';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';
import { getUser } from '@/utils/user/getUser';
import { createPreferences } from '@/utils/user/owner/createPreferences';
import { updatePreferences } from '@/utils/user/owner/updatePreferences';
import { getPreferences } from '@/utils/user/owner/getPreferences';

const PreferencesPage = () => {
    const [preferences, setPreferences] = useState({
        preferredSpecies: '',
        preferredBreed: '',
        preferredColor: '',
        preferredSex: '',
        preferredAge: '',
    });
    const [preferenceObject, setPreferenceObject] = useState(null);
    const [user, setUser] = useState(null);

    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser(token, email);
                setUser(userData);
                if (userData?.preference) {
                    setPreferenceObject(userData.preference);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [token, email]);

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!preferenceObject) return; // Ensure preferenceId is available
            try {
                const response = await getPreferences(token, preferenceObject.preferenceId);
                if (response) {
                    setPreferences(response); // Prepopulate fields with existing preferences
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
            const createResponse = await createPreferences(token, user, preferences);
            setPreferenceObject(createResponse.data);
        }
        else {
            console.log('Updating existing preference');
            try {
                const updateResponse = await updatePreferences(token, preferences, preferenceObject.preferenceId);
                console.log(updateResponse.data);
                if (updateResponse.status === 200) {
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
                                    label="Preferred Sex"
                                    name="preferredSex"
                                    value={preferences.preferredSex}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    label="Preferred Age"
                                    name="preferredAge"
                                    type="text"
                                    value={preferences.preferredAge}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 99)) {
                                            setPreferences({ ...preferences, preferredAge: value });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                            e.preventDefault();
                                        }
                                    }}
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