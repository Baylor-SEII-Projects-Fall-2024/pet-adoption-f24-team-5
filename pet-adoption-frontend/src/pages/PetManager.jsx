import React, { useEffect } from 'react'
import {
    Typography,
    Box,
    Button,
    Toolbar,
    Stack, CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from '../utils/axiosConfig';
import PetCard from "@/components/PetCard";
import PetFormComponent from "@/components/PetFormComponent";
import { API_URL } from "@/constants";
import TitleBar from "@/components/TitleBar";
import { useSelector } from 'react-redux';
import { getSubjectFromToken } from "@/utils/tokenUtils";
const PetManager = () => {
    const [formType, setFormType] = React.useState('');
    const [pets, setPets] = React.useState([]);
    const [postNewPet, setPostNewPet] = React.useState(false);
    const token = useSelector((state) => state.user.token);
    const [formPet, setFormPet] = React.useState({});
    const [loading, setLoading] = React.useState(true);

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


    const getAllPets = async () => {
        setLoading(true);
        setPets([]);

        const url = `${API_URL}/api/pets/center?email=${getSubjectFromToken(token)}`;

        try {
            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'application/json'
                },
            });
            setPets(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (postNewPet === false) {
            getAllPets();
            setFormType('');
        }
    }, [postNewPet]);




    return (
        <Box>
            {postNewPet && (
                <PetFormComponent type={formType} handlePostNewPet={handlePostNewPet} pet={formPet} />
            )}

            {!postNewPet &&
                <Stack sx={{ paddingTop: 4 }} alignItems='center' gap={5}>
                    <Button onClick={handlePostNewPet} color='inherit' variant='contaiend'>Post Pet</Button>

                    {loading ? <CircularProgress /> :
                        ((pets.length > 0) && pets.map((pet) => (
                            <PetCard pet={pet} key={pet.petName} onClick={() => handleCardClick(pet)} />
                        )))
                    }

                </Stack>
            }


        </Box>

    );
};

export default PetManager