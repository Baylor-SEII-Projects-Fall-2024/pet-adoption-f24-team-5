import React, { useEffect } from 'react'
import {
    Typography,
    Box,
    Button,
    Toolbar,
    Stack, CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from '../utils/redux/axiosConfig';
import PetCard from "@/components/petCard/PetCard";
import PetFormComponent from "@/components/petForm/PetFormComponent";
import { API_URL } from "@/constants";
import TitleBar from "@/components/titleBar/TitleBar";
import { useSelector } from 'react-redux';
import { getAllPets } from "@/utils/user/center/getAllPets";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";

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


    const getPets = async () => {
        setLoading(true);
        const pets = await getAllPets(token);
        setPets(pets);
        setLoading(false);
    };

    useEffect(() => {
        if (postNewPet === false) {
            getPets();
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
                    <Button onClick={handlePostNewPet} color='inherit' variant='contained'>Post Pet</Button>

                    {loading ? <CircularProgress /> :
                        ((pets.length > 0) && pets.slice(0, 10).map((pet) => (
                            <PetCard pet={pet} expandable={false} saveable={false} likeable={false} key={pet.petName} onClick={() => handleCardClick(pet)} />
                        )))
                    }

                </Stack>
            }


        </Box>

    );
};

export default PetManager