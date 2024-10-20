import {Box, Button, Select, Stack, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import ImageUploadComponent from "@/components/ImageUploadComponent";
import React, {useEffect, useState} from "react";
import {saveUpdatePet} from "@/utils/SaveUpdatePet";



const PetFormComponent = (props) => {
    const [petId, setPetId] = useState(null);
    const [formType, setFormType] = React.useState('');
    const [species, setSpecies] = React.useState('');
    const [petName, setPetName] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [color, setPetColor] = React.useState('');
    const [age, setAge] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [adoptionStatus, setStatus] = React.useState(false);
    const [imageName, setImageName] = React.useState('');
    const [buttonText, setButtonText] = React.useState('');
    const token = localStorage.getItem('token');


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
        setAge(pet.age);
        setStatus(pet.adoptionStatus);
        setDescription(pet.description);
        setImageName(pet.imageName);
    }

    const resetFields = () => {
        setSpecies("");
        setPetName("");
        setBreed("")
        setPetName("");
        setAge("");
        setDescription("");
        setPetColor("");
        setStatus(false);
        setImageName('');
    }

    const handleImageUpload = (name) => {
        console.log("Uploaded image name:", name);
        setImageName(name);
    };

    const handleChangeSelection = (event) => {
        setStatus(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        handleSaveOrUpdatePet();
    }


    const handleSaveOrUpdatePet = () => {

        const basePetData = {
            species,
            petName,
            breed,
            color,
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

        saveUpdatePet({formType, petData, token, resetFields});

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
                <TextField
                    label="Species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Pet Color"
                    value={color}
                    onChange={(e) => setPetColor(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    type="paragraph"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
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
                <ImageUploadComponent onImageUpload={handleImageUpload}/>
                <Button type="submit" variant="contained">{buttonText}</Button>
            </Stack>
        </Box>
    )


}

export default PetFormComponent;