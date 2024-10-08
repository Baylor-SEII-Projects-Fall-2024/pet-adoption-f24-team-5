import React, {useEffect} from 'react'
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Toolbar,
    Stack,
    TextField,
    Select,
    LinearProgress
} from "@mui/material";
import {Link} from "react-router-dom";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";

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
    const [uploadProgress, setUploadProgress] = React.useState(0);


    const handlePostNewPet = () => {
        setPostNewPet(!postNewPet);
    }


    const getAllPets = () => {

        const url = "http://localhost:8080/api/pets";

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

    const handleChangeSelection = (event) => {
        setStatus(event.target.value);
    }

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        //resolve api here
        axios.post('/upload', formData, {
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100)/ progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const resetFields = () => {
        setSpecies("");
        setPetName("");
        setBreed("")
        setPetName("");
        setAge("");
        setDescription("");
        setPetColor("");
        setStatus(false);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        const petData = {
            species,
            petName,
            breed,
            petColor,
            age,
            adoptionStatus,
            description,
        };

        console.log('Pet Data: ', petData);

        const url = "http://localhost:8080/api/pets/save/pet";

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
                <Typography variant='body2' align='center'>{pet.species}</Typography>
                <Typography variant='body2' align='center'>{pet.breed}</Typography>
                <Typography variant='body2' align='center'>{pet.color}</Typography>
                <Typography variant='body2' align='center'>{pet.age}</Typography>
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
                        <Select
                            defaultValue="Up For Adoption"
                            label="Adoption Status"
                            value={adoptionStatus}
                            onChange={handleChangeSelection}
                            >
                            <MenuItem value={'false'}>Up For Adoption</MenuItem>
                            <MenuItem value={'true'}>Owned</MenuItem>
                        </Select>
                        <TextField type="file" />
                        <LinearProgress variant="determinate" value={uploadProgress} />
                        <Button variant="contained"
                                color="primary"
                                component="span"
                                onClick={handleFileUpload}>Upload</Button>

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