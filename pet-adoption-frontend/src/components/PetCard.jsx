import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchImage } from '@/utils/fetchImage';

const PetCard = ({ pet, onClick }) => {
    const [error, setError] = useState(false); // Track fetch errors
    const [imageType, setImageType] = useState("");
    const [imageData, setImageData] = useState("");


    useEffect(() => {

        const loadImage = async () => {
            try {
                const {imageType, imageData} = await fetchImage(pet.imageName); // Fetch image URL
                setImageType(imageType);
                setImageData(imageData);

            } catch (err) {
                console.error('Image fetch failed:', err);
                setError(true); // Set error state on failure
            }
        };

        if (pet.imageName) loadImage(); // Trigger image load if name exists

    }, [pet.imageName]);

    const handleImageError = () => {
        setError(true); // Handle image load errors
    };

    return (
        <Card onClick={onClick}
              sx={{ width: '48%',
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': {
                    border: '2px solid blue',
                    },}} elevation={4} key={pet.petName}>
            <CardContent>
                    <img
                        src={`data:${imageType};base64,${imageData}`}
                        alt="Pet"
                        onError={handleImageError}
                        style={{
                            float: 'left',
                            margin: '0 15px 15px 0',
                            width: '100%',
                            maxWidth: '200px',
                            height: 'auto',
                        }}
                    />
                    <>
                        <Typography variant="h4" align="left">
                            {pet.petName}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.species}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.breed}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.color}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.age}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.description}
                        </Typography>
                    </>
            </CardContent>
        </Card>
    );
};

export default PetCard;
