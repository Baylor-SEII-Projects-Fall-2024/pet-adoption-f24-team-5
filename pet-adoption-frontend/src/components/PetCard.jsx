import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import {fetchImage} from "@/utils/fetchImage";

const PetCard = ({ pet, onClick }) => {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if (pet.imageName) {
            fetchImage(pet.imageName).then(imgUrl => {
                if (imgUrl) {
                    setImageSrc(imgUrl);
                }
            });
        }}, [pet.imageName]);


    return (
        <Card onClick={onClick}
              sx={{ width: '48%',
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': {
                    border: '2px solid blue',
                    },}} elevation={4} key={pet.petName}>
            <CardContent>
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Pet"
                        style={{
                            float: 'left',
                            margin: '0 15px 15px 0',
                            imagewidth: '100%',
                            maxWidth: '200px',
                            height: 'auto'
                        }}
                    />
                ) : (
                    <p>Loading image...</p>
                )}
                <Typography variant='h4' align='left'>{pet.petName}</Typography>
                <Typography variant='body2' align='left'>{pet.species}</Typography>
                <Typography variant='body2' align='left'>{pet.breed}</Typography>
                <Typography variant='body2' align='left'>{pet.color}</Typography>
                <Typography variant='body2' align='left'>{pet.age}</Typography>
                <Typography variant='body2' align='left'>{pet.description}</Typography>
            </CardContent>
        </Card>
    );
};

export default PetCard;
