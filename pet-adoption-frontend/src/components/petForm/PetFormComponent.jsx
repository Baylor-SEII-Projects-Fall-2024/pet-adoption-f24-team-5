import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, Grid, Paper, InputAdornment, Divider } from "@mui/material";
import ImageUploadComponent from "@/components/imageComponent/ImageUploadComponent";
import React, { useEffect, useState } from "react";
import { saveUpdatePet } from "@/utils/pet/SaveUpdatePet";
import { useSelector } from 'react-redux';
import { deletePet } from "@/utils/pet/DeletePet";
import SearchableDropdown from "@/components/petForm/SearchableDropdown";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllPets } from "@/utils/pet/getAllPets";
import AddIcon from '@mui/icons-material/Add';

const PetFormComponent = (props) => {
    const [petId, setPetId] = useState(null);
    const [formType, setFormType] = React.useState('');
    const [species, setSpecies] = React.useState('');
    const [speciesInput, setSpeciesInput] = useState('');
    const [petName, setPetName] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [breedInput, setBreedInput] = React.useState('');
    const [color, setPetColor] = React.useState('');
    const [colorInput, setPetColorInput] = React.useState('');
    const [age, setAge] = React.useState('');
    const [sex, setSex] = React.useState('');
    const [sexInput, setSexInput] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [adoptionStatus, setStatus] = React.useState(false);
    const [adoptionStatusInput, setStatusInput] = React.useState(false);
    const [imageName, setImageName] = React.useState('');
    const [buttonText, setButtonText] = React.useState('');
    const token = useSelector((state) => state.user.token);
    const [availableSpecies, setAvailableSpecies] = useState([]);
    const [availableBreeds, setAvailableBreeds] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [availableSexes, setAvailableSexes] = useState([]);
    const [isCustomSpecies, setIsCustomSpecies] = useState(false);
    const [isCustomBreed, setIsCustomBreed] = useState(false);
    const [isCustomColor, setIsCustomColor] = useState(false);

    useEffect(() => {
        setFormType(props.type);
        if (props.type === "save") {
            setButtonText("Save Pet");
        } else if (props.type === "update") {
            setButtonText("Update Pet");
        }
        if (props.pet && props.pet.petId) {
            setFields(props.pet);
        } else {
            resetFields();
        }

    }, [props.type, props.pet]);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const petsData = await getAllPets(token);
                const uniqueSpecies = [...new Set(petsData.map(pet => pet.species))];
                setAvailableSpecies(uniqueSpecies);
            } catch (error) {
                console.error('Error fetching pet data:', error);
            }
        };

        fetchPetData();
    }, [token]);

    useEffect(() => {
        const updateBreeds = async () => {
            if (!species) return;

            try {
                const petsData = await getAllPets(token);
                const uniqueBreeds = [...new Set(
                    petsData
                        .filter(pet => pet.species === species)
                        .map(pet => pet.breed)
                )];
                setAvailableBreeds(uniqueBreeds);

                if (formType !== "update") {
                    setBreed('');
                }
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        };

        updateBreeds();
    }, [species, token, formType]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const petsData = await getAllPets(token);
                const uniqueColors = [...new Set(petsData.map(pet => pet.color))];
                setAvailableColors(uniqueColors);
            } catch (error) {
                console.error('Error fetching colors:', error);
            }
        };

        fetchColors();
    }, [token]);

    useEffect(() => {
        const fetchSexes = async () => {
            try {
                const petsData = await getAllPets(token);
                const uniqueSexes = [...new Set(petsData.map(pet => pet.sex))];
                setAvailableSexes(uniqueSexes);
            } catch (error) {
                console.error('Error fetching sexes:', error);
            }
        };

        fetchSexes();
    }, [token]);

    const setFields = (pet) => {
        setPetId(pet.petId);
        setSpecies(pet.species);
        setPetName(pet.petName);
        setBreed(pet.breed);
        setPetColor(pet.color);
        setSex(pet.sex);
        setAge(pet.age);
        setStatus(pet.adoptionStatus);
        setDescription(pet.description);
        setImageName(pet.imageName);
    }

    const resetFields = () => {
        setSpecies("");
        setPetName("");
        setBreed("")
        setSex("");
        setPetName("");
        setAge("");
        setDescription("");
        setPetColor("");
        setStatus(false);
        setImageName("");
    }

    const handleImageUpload = (name) => {
        console.log("Uploaded image name:", name);
        setImageName(name);
    };

    const handleAdoptionStatusChange = (newValue) => {
        setStatus(newValue.value); // Map the selected option to a boolean value
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        handleSaveOrUpdatePet();
    }

    const getBreedOptions = () => {
        return availableBreeds;
    };

    const handleDelete = (event) => {
        event.preventDefault();

        const petData = {
            petId,
            species,
            petName,
            breed,
            color,
            sex,
            age,
            adoptionStatus,
            description,
            imageName,
        }

        deletePet({
            petData,
            token,
            resetFields,
            handlePostNewPet: props.handlePostNewPet
        });

    }
    const handleChangeSelection = (event) => {
        setStatus(event.target.value);
    }

    const handleSaveOrUpdatePet = () => {

        const basePetData = {
            species,
            petName,
            breed,
            color,
            sex,
            age,
            adoptionStatus,
            description,
            imageName,
        }

        const petData = (formType === "update")
            ? {
                petId,
                ...basePetData,
            }
            : basePetData;

        saveUpdatePet({
            formType, petData, token, resetFields,
            handlePostNewPet: props.handlePostNewPet
        }
        );

    }


    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                height: '92vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1.5,
                px: 2,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                minHeight: '56px',
                flexShrink: 0,
            }}>
                <Button
                    onClick={props.handlePostNewPet}
                    variant='outlined'
                    startIcon={<ArrowBackIcon />}
                    size="small"
                >
                    Back to Pets
                </Button>
                <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                    {formType === "update" ? "Edit Pet Details" : "Add New Pet"}
                </Typography>
            </Box>

            <Box sx={{
                flex: 1,
                overflow: 'auto',
                p: 3,
            }}>
                <Box sx={{
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <Grid container spacing={2.5}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Pet Name"
                                value={petName}
                                onChange={(e) => setPetName(e.target.value)}
                                required
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                '& .MuiFormControl-root': {
                                    flex: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                },
                                width: '100%',
                            }}>
                                {!isCustomSpecies ? (
                                    <>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Species</InputLabel>
                                            <Select
                                                value={species}
                                                onChange={(e) => setSpecies(e.target.value)}
                                                label="Species"
                                                sx={{
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: 1,
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'divider'
                                                    }
                                                }}
                                            >
                                                {availableSpecies.map((speciesOption) => (
                                                    <MenuItem key={speciesOption} value={speciesOption}>
                                                        {speciesOption}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            onClick={() => setIsCustomSpecies(true)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            label="Enter New Species"
                                            value={speciesInput}
                                            onChange={(e) => {
                                                setSpeciesInput(e.target.value);
                                                setSpecies(e.target.value);
                                            }}
                                            size="small"
                                            autoFocus
                                            sx={{
                                                flex: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={() => {
                                                setIsCustomSpecies(false);
                                                setSpecies('');
                                                setSpeciesInput('');
                                            }}
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'error.lighter',
                                                }
                                            }}
                                        >
                                            ×
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                '& .MuiFormControl-root': {
                                    flex: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                },
                                width: '100%',
                            }}>
                                {!isCustomBreed ? (
                                    <>
                                        <FormControl size="small" sx={{ flex: 1 }}>
                                            <InputLabel>Breed</InputLabel>
                                            <Select
                                                value={breed}
                                                onChange={(e) => setBreed(e.target.value)}
                                                label="Breed"
                                                sx={{
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: 1,
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'divider'
                                                    }
                                                }}
                                            >
                                                {getBreedOptions().map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            onClick={() => setIsCustomBreed(true)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            label="Enter New Breed"
                                            value={breedInput}
                                            onChange={(e) => {
                                                setBreedInput(e.target.value);
                                                setBreed(e.target.value);
                                            }}
                                            size="small"
                                            autoFocus
                                            sx={{
                                                flex: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={() => {
                                                setIsCustomBreed(false);
                                                setBreed('');
                                                setBreedInput('');
                                            }}
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                width: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'error.lighter',
                                                }
                                            }}
                                        >
                                            ×
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                '& .MuiFormControl-root': {
                                    flex: 1,
                                },
                                '& .MuiOutlinedInput-root': {
                                    height: '40px',
                                    backgroundColor: 'background.paper',
                                    borderRadius: 1,
                                },
                                width: '100%',
                            }}>
                                {!isCustomColor ? (
                                    <>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Pet Color</InputLabel>
                                            <Select
                                                value={color}
                                                onChange={(e) => setPetColor(e.target.value)}
                                                label="Pet Color"
                                                sx={{
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                    borderRadius: 1,
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'divider'
                                                    }
                                                }}
                                            >
                                                {availableColors.map((colorOption) => (
                                                    <MenuItem key={colorOption} value={colorOption}>
                                                        {colorOption}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button
                                            onClick={() => setIsCustomColor(true)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                }
                                            }}
                                        >
                                            <AddIcon />
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <TextField
                                            label="Enter New Color"
                                            value={colorInput}
                                            onChange={(e) => {
                                                setPetColorInput(e.target.value);
                                                setPetColor(e.target.value);
                                            }}
                                            fullWidth
                                            size="small"
                                            autoFocus
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    height: '40px',
                                                    backgroundColor: 'background.paper',
                                                }
                                            }}
                                        />
                                        <Button
                                            onClick={() => {
                                                setIsCustomColor(false);
                                                setPetColor('');
                                                setPetColorInput('');
                                            }}
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            sx={{
                                                minWidth: '40px',
                                                height: '40px',
                                                p: 0,
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                ml: 1,
                                                m: 0,
                                                '& .MuiButton-root': {
                                                    margin: 0,
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'error.lighter',
                                                }
                                            }}
                                        >
                                            ×
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sex</InputLabel>
                                <Select
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                    label="Sex"
                                    sx={{
                                        height: '40px',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'divider'
                                        }
                                    }}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Age"
                                type="number"
                                value={age}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 0 && parseInt(value, 10) <= 99)) {
                                        setAge(value);
                                    }
                                }}
                                required
                                fullWidth
                                size="small"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">years</InputAdornment>,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Adoption Status</InputLabel>
                                <Select
                                    value={adoptionStatus}
                                    onChange={handleChangeSelection}
                                    label="Adoption Status"
                                    sx={{
                                        height: '40px',
                                        backgroundColor: 'background.paper',
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'divider'
                                        }
                                    }}
                                >
                                    <MenuItem value={'false'}>Up For Adoption</MenuItem>
                                    <MenuItem value={'true'}>Owned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper
                                variant="outlined"
                                sx={{
                                    p: 3,
                                    backgroundColor: 'background.default',
                                    mt: 1
                                }}
                            >
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                    Pet Image
                                </Typography>
                                <ImageUploadComponent onImageUpload={handleImageUpload} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            <Box sx={{
                display: 'flex',
                gap: 2,
                py: 1.5,
                px: 2,
                borderTop: 1,
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                minHeight: '56px',
                flexShrink: 0,
            }}>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                >
                    {buttonText}
                </Button>
                {formType === "update" && (
                    <Button
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        fullWidth
                        size="large"
                    >
                        Delete Pet
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default PetFormComponent;