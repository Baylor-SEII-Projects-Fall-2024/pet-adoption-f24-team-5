import React, { useState, useEffect } from 'react';
import {
    Button, TextField, Stack, Typography, Box, MenuItem, InputAdornment,
    Autocomplete
} from '@mui/material';
import { Email, Lock, Phone } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { handleRegisterUser } from '../utils/register/registerUser';
import { useGoogleMaps } from '../components/GoogleMapsProvider';

const Register = () => {
    const [registrationData, setRegistrationData] = useState({
        userType: 'Owner',
        emailAddress: '',
        password: '',
        phoneNumber: '',
        firstName: '',
        lastName: '',
        age: '',
        centerZip: '',
        numberOfPets: 0
    });
    const [errorMessage, setErrorMessage] = useState('');
    const { isLoaded } = useGoogleMaps();
    const [addressPredictions, setAddressPredictions] = useState([]);
    const [autocompleteService, setAutocompleteService] = useState(null);
    const [geocoder, setGeocoder] = useState(null);
    const [addressError, setAddressError] = useState('');
    const [isAddressValid, setIsAddressValid] = useState(false);

    useEffect(() => {
        if (isLoaded && window.google) {
            setAutocompleteService(new window.google.maps.places.AutocompleteService());
            setGeocoder(new window.google.maps.Geocoder());
        }
    }, [isLoaded]);

    const handleAddressSearch = async (searchText) => {
        if (!searchText || !autocompleteService) return;

        try {
            const response = await autocompleteService.getPlacePredictions({
                input: searchText,
                componentRestrictions: { country: 'us' },
                types: ['address']
            });

            setAddressPredictions(response.predictions || []);
        } catch (error) {
            console.error('Error fetching address predictions:', error);
        }
    };

    const validateAddress = async (address) => {
        if (!geocoder) return false;

        try {
            const response = await geocoder.geocode({ address });
            if (response.results && response.results.length > 0) {
                // Check if it's a valid street address
                const isStreetAddress = response.results[0].types.includes('street_address') ||
                    response.results[0].types.includes('premise');

                if (!isStreetAddress) {
                    setAddressError('Please enter a valid street address');
                    setIsAddressValid(false);
                    return false;
                }

                setAddressError('');
                setIsAddressValid(true);
                return true;
            }

            setAddressError('Please enter a valid address');
            setIsAddressValid(false);
            return false;
        } catch (error) {
            console.error('Error validating address:', error);
            setAddressError('Error validating address');
            setIsAddressValid(false);
            return false;
        }
    };

    const handleAddressSelect = async (prediction) => {
        if (!prediction || !geocoder) return;

        try {
            const response = await geocoder.geocode({
                placeId: prediction.place_id
            });

            if (response.results[0]) {
                const address = response.results[0];
                const addressComponents = address.address_components;

                // Validate the address type
                const isStreetAddress = address.types.includes('street_address') ||
                    address.types.includes('premise');

                if (!isStreetAddress) {
                    setAddressError('Please enter a valid street address');
                    setIsAddressValid(false);
                    return;
                }

                // Extract address components
                const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
                const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
                const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
                const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
                const zip = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';

                if (!streetNumber || !route || !city || !state || !zip) {
                    setAddressError('Please enter a complete address');
                    setIsAddressValid(false);
                    return;
                }

                setRegistrationData(prev => ({
                    ...prev,
                    centerAddress: `${streetNumber} ${route}`.trim(),
                    centerCity: city,
                    centerState: state,
                    centerZip: zip
                }));

                setAddressError('');
                setIsAddressValid(true);
            }
        } catch (error) {
            console.error('Error geocoding address:', error);
            setAddressError('Error validating address');
            setIsAddressValid(false);
        }
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Phone number formatting function
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, ''); // Remove non-digit characters
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/); // Match groups of numbers

        if (match) {
            return [match[1], match[2], match[3]].filter(Boolean).join('-'); // Join with '-' separator
        }
        return value;
    };

    const handlePhoneNumberChange = (e) => {
        const formattedNumber = formatPhoneNumber(e.target.value);
        setRegistrationData({ ...registrationData, phoneNumber: formattedNumber });
    };

    // Add this validation function
    const validateZipCode = (zip) => {
        const zipRegex = /^\d{5}$/;
        return zipRegex.test(zip);
    };

    // Modify handleSubmit to include complete address validation
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (registrationData.userType === 'CenterOwner') {
            // Reset error messages
            setErrorMessage('');
            setAddressError('');

            // Validate all address fields are filled
            if (!registrationData.centerAddress?.trim()) {
                setAddressError('Street address is required');
                return;
            }

            if (!registrationData.centerCity?.trim()) {
                setErrorMessage('City is required');
                return;
            }

            if (!registrationData.centerState?.trim()) {
                setErrorMessage('State is required');
                return;
            }

            if (!validateZipCode(registrationData.centerZip)) {
                setErrorMessage('Please enter a valid 5-digit zip code');
                return;
            }

            if (!isAddressValid) {
                setErrorMessage('Please select a valid address from the suggestions');
                return;
            }

            // Validate the complete address one more time before submission
            const fullAddress = `${registrationData.centerAddress}, ${registrationData.centerCity}, ${registrationData.centerState} ${registrationData.centerZip}`;
            const isValid = await validateAddress(fullAddress);

            if (!isValid) {
                setErrorMessage('Please enter a valid complete address');
                return;
            }
        }

        handleRegisterUser(registrationData, navigate, dispatch, setErrorMessage);
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #4b6cb7 30%, #182848 90%)',
                overflow: 'auto',
            }}
        >
            <Box
                sx={{
                    width: '400px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
                    padding: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="User Type"
                            value={registrationData.userType}
                            onChange={(e) => setRegistrationData({ ...registrationData, userType: e.target.value })}
                            required
                            fullWidth
                        >
                            <MenuItem value="CenterOwner">Adoption Center</MenuItem>
                            <MenuItem value="Owner">Pet Owner</MenuItem>
                        </TextField>

                        <TextField
                            label="Email"
                            type="email"
                            value={registrationData.emailAddress}
                            onChange={(e) => setRegistrationData({ ...registrationData, emailAddress: e.target.value })}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            value={registrationData.password}
                            onChange={(e) => setRegistrationData({ ...registrationData, password: e.target.value })}
                            required
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Phone Number"
                            type="tel"
                            value={registrationData.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                            fullWidth
                            inputProps={{ maxLength: 12 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {registrationData.userType === 'CenterOwner' && (
                            <>
                                <TextField
                                    label="Adoption Center Name"
                                    value={registrationData.centerName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, centerName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <Autocomplete
                                    freeSolo
                                    options={addressPredictions}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.description
                                    }
                                    onInputChange={(_, newValue) => {
                                        handleAddressSearch(newValue);
                                        if (!newValue) {
                                            setIsAddressValid(false);
                                            setAddressError('');
                                        }
                                    }}
                                    onChange={(_, newValue) => {
                                        if (newValue && typeof newValue !== 'string') {
                                            handleAddressSelect(newValue);
                                        } else {
                                            setIsAddressValid(false);
                                            setAddressError('Please select an address from the suggestions');
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Address"
                                            required
                                            fullWidth
                                            error={!!addressError}
                                            helperText={addressError || 'Please select an address from the suggestions'}
                                            value={registrationData.centerAddress}
                                            onChange={(e) => {
                                                setRegistrationData({
                                                    ...registrationData,
                                                    centerAddress: e.target.value
                                                });
                                                setIsAddressValid(false);
                                                setAddressError('Please select an address from the suggestions');
                                            }}
                                        />
                                    )}
                                />
                                <TextField
                                    label="City"
                                    value={registrationData.centerCity}
                                    required
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-readOnly': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            cursor: 'default',
                                        }
                                    }}
                                />
                                <TextField
                                    label="State"
                                    value={registrationData.centerState}
                                    required
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-readOnly': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            cursor: 'default',
                                        }
                                    }}
                                />
                                <TextField
                                    label="Zip Code"
                                    value={registrationData.centerZip}
                                    required
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-readOnly': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                            cursor: 'default',
                                        }
                                    }}
                                />
                            </>
                        )}

                        {registrationData.userType === 'Owner' && (
                            <>
                                <TextField
                                    label="First Name"
                                    type="text"
                                    value={registrationData.firstName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Last Name"
                                    type="text"
                                    value={registrationData.lastName}
                                    onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Zip Code"
                                    type="text"
                                    value={registrationData.centerZip}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value))) {
                                            setRegistrationData({ ...registrationData, centerZip: value });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                            e.preventDefault();
                                        }
                                    }}
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 5 }}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Age"
                                    type="text" // Use text for more control over input
                                    value={registrationData.age}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) > 0 && parseInt(value, 10) <= 100)) {
                                            setRegistrationData({ ...registrationData, age: value });
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        // Prevent non-numeric key presses
                                        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                                            e.preventDefault();
                                        }
                                    }}
                                    required
                                    fullWidth
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 1, max: 100 }}
                                />
                            </>
                        )}

                        {errorMessage && (
                            <Typography variant="body2" color="error">
                                {errorMessage}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{
                                background: 'linear-gradient(90deg, #43cea2, #185a9d)',
                                color: 'white',
                                borderRadius: '50px',
                                padding: '10px 0',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #185a9d, #43cea2)',
                                },
                            }}
                        >
                            Register
                        </Button>
                    </Stack>
                </form>

                <Typography variant="body2" marginTop={2}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#43cea2', textDecoration: 'none' }}>
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Register;
