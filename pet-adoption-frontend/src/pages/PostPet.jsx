import React, {useEffect} from 'react'
import {Card, CardContent, Typography, Box, Button, Toolbar, Stack, TextField} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";

const PostPet = () => {
    const [species, setSpecies] = React.useState('');
    const [petName, setPetName] = React.useState('');
    const [breed, setBreed] = React.useState('');
    const [petColor, setPetColor] = React.useState('');
    const [age, setAge] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [adoptionStatus, setStatus] = React.useState(false);
    const [image, setImage] = React.useState('');
    const [pets, setPets] = React.useState( [] );
    const [postNewPet, setPostNewPet] = React.useState(false);


    const handlePostNewPet = () => {
        setPostNewPet(!postNewPet);
    }

    const url = process.env.REACT_APP_BACKEND_URL + "/pets";

    const getAllPets = () => {
        axios.get(url)
            .then((res) => {
                setPets(res.data);
                console.log(res.data);
            })
            .catch(error => console.error(`Error getting pets: ${error}`));
    };

    useEffect(() => {
        getAllPets();
    }, []);

    const resetFields = () => {
        setSpecies("");
        setPetName("");
        setBreed("")
        setPetName("");
        setAge("");
        setDescription("");
        setPetColor("");
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const petData = {
            species,
            petName,
            breed,
            petColor,
            age,
            adoptionStatus: false,
            description,
        };

        console.log('Pet Data: ', petData);

        const url = process.env.REACT_APP_BACKEND_URL + "/pets/save/pet";

        axios
            .post(url, petData)
            .then((res) => {
                alert('Pet Saved!');
                resetFields();
            })
            .catch((err) => {
                console.error('An error occurred during registration:', err);
                alert('An error occured saving pet. Please try again later.');
            });
    };

    const PetCard = ({ pet }) => (
        <Card sx={{ width: '48%' }} elevation={4} key={pet.petName}>
            <CardContent>
                <Typography variant='h5' align='center'>{pet.petName}</Typography>
                <Typography variant='body2' align='center'>{pet.description}</Typography>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{ height: '8vh', width: '100vw', backgroundColor: 'primary.main' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Post Pet
                    </Typography>
                    <Button color="inherit" component={Link} to="/PostPet">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </Box>



            {postNewPet && (
                <Box component="form" onSubmit={handleSubmit}>
                    <Button onClick={handlePostNewPet} variant='contaiend'>Back to Pets</Button>

                    <Stack spacing={2}>
                        <TextField
                            label="Species"
                            value={species}
                            onChange={(e) => setSpecies(e.target.value)}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Pet Name"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
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
                            value={petColor}
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
                        <Button type="submit" variant="contained">Post</Button>

                    </Stack>
                    </Box>
                )}

                {!postNewPet && (

                    <Stack sx={{paddingTop:4}} alignItems='center' gap={5}>
                        <Button onClick={handlePostNewPet} color='inherit' variant='contaiend'>Post Pet</Button>

                        {pets.map((pet) => (
                            <PetCard pet={pet} key={pet.petName} />
                        ))}
                    </Stack>)
                }


        </Box>

    );
};

export default PostPet