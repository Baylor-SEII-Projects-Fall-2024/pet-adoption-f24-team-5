import {Card, CardContent, Typography} from "@mui/material";
import React from "react";


export const PetCard = ({ pet }) => (
    <Card sx={{ width: '48%' }} elevation={4} key={pet.petName}>
        <CardContent>
            <img
                src={`http://localhost:8080/api/images/${pet.imageName}`}
                alt="Pet"
                style={{
                    float: 'left',
                    margin: '0 15px 15px 0',
                    imagewidth: '100%',
                    maxWidth: '200px',
                    height: 'auto'
                }}

            />
            <Typography variant='h4' align='left'>{pet.petName}</Typography>
            <Typography variant='body2' align='left'>{pet.species}</Typography>
            <Typography variant='body2' align='left'>{pet.breed}</Typography>
            <Typography variant='body2' align='left'>{pet.color}</Typography>
            <Typography variant='body2' align='left'>{pet.age}</Typography>
            <Typography variant='body2' align='left'>{pet.description}</Typography>
        </CardContent>
    </Card>
);