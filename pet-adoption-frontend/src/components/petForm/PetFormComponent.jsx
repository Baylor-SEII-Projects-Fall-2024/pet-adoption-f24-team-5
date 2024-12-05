import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";
import ImageUploadComponent from "@/components/imageComponent/ImageUploadComponent";
import React, { useEffect, useState } from "react";
import { saveUpdatePet } from "@/utils/pet/SaveUpdatePet";
import { useSelector } from 'react-redux';
import { deletePet } from "@/utils/pet/DeletePet";
import SearchableDropdown from "@/components/petForm/SearchableDropdown";

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

    const speciesOptions = ["Dog", "Cat", "Snake"];
    const dogBreeds = ["Golden Retriever", "Labrador Retriever", "German Shepherd", "French Bulldog", "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier",
        "Boxer", "Dachshund", "Siberian Husky", "Shih Tzu", "Australian Shepherd", "Cavalier King Charles Spaniel", "Doberman Pinscher", "Miniature Schnauzer",
        "Great Dane", "Shiba Inu", "Cocker Spaniel", "Pug", "Border Collie", "Maltese", "Chihuahua", "Bernese Mountain Dog", "Basset Hound", "Havanese",
        "Pembroke Welsh Corgi", "Vizsla", "Weimaraner", "Newfoundland", "Collie", "West Highland White Terrier", "Rhodesian Ridgeback", "Saint Bernard", "Boston Terrier",
        "Akita", "Alaskan Malamute", "Bull Terrier", "American Staffordshire Terrier", "Australian Cattle Dog", "Bichon Frise", "Papillon", "Samoyed", "Whippet",
        "English Springer Spaniel", "Irish Setter", "Scottish Terrier", "Chow Chow", "Pekingese"]
    const catBreeds = ["Domestic Shorthair", "Domestic Longhair", "Maine Coon", "Siamese", "Persian", "Ragdoll", "Bengal", "Sphynx", "British Shorthair", "Scottish Fold", "Abyssinian",
        "Russian Blue", "Birman", "American Shorthair", "Oriental Shorthair", "Devon Rex", "Cornish Rex", "Norwegian Forest Cat", "Himalayan", "Turkish Angora", "Savannah",
        "Balinese", "Tonkinese", "Bombay", "Chartreux", "Singapura", "Manx", "Burmese", "Selkirk Rex", "Egyptian Mau", "Exotic Shorthair", "American Curl", "Turkish Van", "LaPerm",
        "Ocicat", "Somali", "Munchkin", "Snowshoe", "Lykoi", "Japanese Bobtail", "Havana Brown", "Pixie-Bob", "Chantilly-Tiffany", "Cymric", "Peterbald", "Khao Manee",
        "American Bobtail", "Siberian", "Toyger", "Korat", "Tabby"]

    const defaultBreed = ["No Selected Species"];

    const sexOptions = ["Male", "Female"];

    const colorOptions = ["Black", "White", "Brown", "Gray", "Tan", "Cream", "Red", "Blue", "Chocolate", "Fawn", "Silver", "Gold", "Sable", "Brindle", "Merle", "Orange", "Lilac", "Tortoiseshell",
        "Calico", "Seal", "Smoke", "Cinnamon", "Buff", "Chestnut", "Piebald", "Harlequin", "Tricolor", "Bicolor", "Black and Tan", "Black and White", "Blue Merle", "Chocolate and White",
        "Cream and White", "Red and White", "Silver and White", "Golden", "Liver", "Isabella", "Wheaten", "Mahogany", "Apricot", "Slate", "Peach", "Lavender", "Champagne", "Mink"]

    const adoptionOptions = ["Up For Adoption", "Owned"];

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
        switch (species) {
            case "Dog":
                return dogBreeds;
            case "Cat":
                return catBreeds;
            case "Snake":
                return "SNAKES!";
            default:
                return defaultBreed;
        }
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
        <Box component="form" onSubmit={handleSubmit}>
            <Button onClick={props.handlePostNewPet} variant='contaiend'>Back to Pets</Button>

            <Stack spacing={2}>
                <TextField
                    label="Pet Name"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    required
                    fullWidth
                />
                <SearchableDropdown
                    label="Species"
                    options={speciesOptions}
                    value={species}
                    inputValue={speciesInput}
                    onChange={(newValue) => setSpecies(newValue)}
                    onInputChange={(newInput) => setSpeciesInput(newInput)}
                    sx={{ width: '100%' }}
                />

                <SearchableDropdown
                    label="Breed"
                    options={getBreedOptions()}
                    value={breed}
                    inputValue={breedInput}
                    onChange={(newValue) => setBreed(newValue)}
                    onInputChange={(newInput) => setBreedInput(newInput)}
                    sx={{ width: '100%' }}
                />

                <SearchableDropdown
                    label="Pet Color"
                    options={colorOptions}
                    value={color}
                    inputValue={colorInput}
                    onChange={(newValue) => setPetColor(newValue)}
                    onInputChange={(newInput) => setPetColorInput(newInput)}
                    sx={{ width: '100%' }}
                />

                <SearchableDropdown
                    label="Sex"
                    options={sexOptions}
                    value={sex}
                    inputValue={sexInput}
                    onChange={(newValue) => setSex(newValue)}
                    onInputChange={(newInput) => setSexInput(newInput)}
                    sx={{ width: '100%' }}
                />

                <TextField
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 99)) {
                            setAge(value);
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
                />
                <TextField
                    label="Description"
                    type="paragraph"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                />
                <Select
                    defaultValue="Up For Adoption"
                    label="Adoption Status"
                    value={adoptionStatus}
                    onChange={handleChangeSelection}
                >
                    <MenuItem value={'false'}>Up For Adoption</MenuItem>
                    <MenuItem value={'true'}>Owned</MenuItem>
                </Select>
                <ImageUploadComponent onImageUpload={handleImageUpload} />
                <Button type="submit" variant="contained">{buttonText}</Button>
                {(props.type === "update") &&
                    <Button type="delete" variant="contained" onClick={handleDelete}>Delete Pet</Button>
                }
            </Stack>

        </Box>
    )


}

export default PetFormComponent;