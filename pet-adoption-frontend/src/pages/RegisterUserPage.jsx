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
import Image from 'next/image';

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
                minHeight: '92vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                py: 2
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    mx: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: '24px',
                    boxShadow: '0 4px 12px rgba(139,115,85,0.1)',
                    p: 3
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                }}>
                    <Image
                        src="/favicon.ico"
                        alt="DogPile Logo"
                        width={48}
                        height={48}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            ml: 2
                        }}
                    >
                        DogPile Solutions
                    </Typography>
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: 'text.primary',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}
                >
                    Register
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 3
                    }}>
                        <TextField
                            select
                            label="User Type"
                            value={registrationData.userType}
                            onChange={(e) => setRegistrationData({ ...registrationData, userType: e.target.value })}
                            required
                            sx={{
                                width: '300px',
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                            size="small"
                        >
                            <MenuItem value="CenterOwner">Adoption Center</MenuItem>
                            <MenuItem value="Owner">Pet Owner</MenuItem>
                        </TextField>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 2,
                        '& .MuiTextField-root': { m: 0 },
                        minHeight: '300px',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}>
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                                size="small"
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                                size="small"
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
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'primary.main',
                                            borderWidth: 2
                                        }
                                    }
                                }}
                                size="small"
                            />
                            <Box sx={{ flex: 1 }} />
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}>
                            {registrationData.userType === 'CenterOwner' ? (
                                <>
                                    <TextField
                                        label="Adoption Center Name"
                                        value={registrationData.centerName}
                                        onChange={(e) => setRegistrationData({ ...registrationData, centerName: e.target.value })}
                                        required
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
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
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '12px',
                                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'primary.main',
                                                            borderWidth: 2
                                                        }
                                                    }
                                                }}
                                                size="small"
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
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
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
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
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
                                            },
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
                                    />
                                </>
                            ) : (
                                <>
                                    <TextField
                                        label="First Name"
                                        type="text"
                                        value={registrationData.firstName}
                                        onChange={(e) => setRegistrationData({ ...registrationData, firstName: e.target.value })}
                                        required
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
                                    />
                                    <TextField
                                        label="Last Name"
                                        type="text"
                                        value={registrationData.lastName}
                                        onChange={(e) => setRegistrationData({ ...registrationData, lastName: e.target.value })}
                                        required
                                        fullWidth
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
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
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '12px',
                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'primary.main',
                                                    borderWidth: 2
                                                }
                                            }
                                        }}
                                        size="small"
                                    />
                                </>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        {errorMessage && (
                            <Typography
                                variant="body2"
                                color="error"
                                sx={{ mb: 1 }}
                            >
                                {errorMessage}
                            </Typography>
                        )}

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: '24px',
                                py: 1,
                                px: 4,
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                },
                            }}
                        >
                            Register
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mt: 1
                            }}
                        >
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                style={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default Register;
