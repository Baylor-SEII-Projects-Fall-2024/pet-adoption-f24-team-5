import React, {useEffect} from 'react'
import {
    Typography,
    Box,
    Button,
    Toolbar,
    Stack,
} from "@mui/material";
import {Link} from "react-router-dom";
import axios from 'axios';
import PetCard from "@/components/PetCard";
import PetFormComponent from "@/components/PetFormComponent";
import {API_URL} from "@/constants";

const PetManager = () => {
    const [formType, setFormType] = React.useState('');
    const [pets, setPets] = React.useState( [] );
    const [postNewPet, setPostNewPet] = React.useState(false);
    const token = localStorage.getItem('token');
    const [formPet, setFormPet] = React.useState({});

    const handleCardClick = (pet) => {
        console.log(pet);
        setFormPet(pet);
        setFormType("update");
        setPostNewPet(!postNewPet);
    }


    const handlePostNewPet = () => {
        setPostNewPet(!postNewPet);
        setFormType("save")
        setFormPet({})
    }


    const getAllPets = () => {

        const url = `${API_URL}/api/pets`;

        axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in the header
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                setPets(res.data);
                console.log(res.data);
            })
            .catch(error => console.error(`Error getting pets: ${error}`));
    };

    useEffect(() => {
        if(postNewPet === false) {
            getAllPets();
            setFormType('');
        }
    }, [postNewPet]);




    return (
        <Box sx={{height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{height: '8vh', width: '100vw', backgroundColor: 'primary.main'}}>
                <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Post Pet
                    </Typography>
                    <Button color="inherit" component={Link} to="/PetManager">Profile</Button>
                    <Button color="inherit" component={Link} to="/SearchEngine">Search Engine</Button>
                    <Button color="inherit" component={Link} to="/Settings">Settings</Button>
                    <Button color="inherit" component={Link} to="/Login">Log Out</Button>
                </Toolbar>
            </Box>



            {postNewPet && (
                <PetFormComponent type={formType} handlePostNewPet={handlePostNewPet} pet={formPet} />
            )}

            {!postNewPet && (

                    <Stack sx={{paddingTop:4}} alignItems='center' gap={5}>
                        <Button onClick={handlePostNewPet} color='inherit' variant='contaiend'>Post Pet</Button>
                        {pets.map((pet) => (
                            <PetCard pet={pet} key={pet.petName} onClick={() => handleCardClick(pet)}/>
                        ))}
                    </Stack>)
                }


        </Box>

    );
};

export default PetManager