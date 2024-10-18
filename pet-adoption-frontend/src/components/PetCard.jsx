import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { fetchImage } from '@/utils/fetchImage';

const PetCard = ({ pet }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true); // Track loading status
    const [error, setError] = useState(false); // Track fetch errors

    useEffect(() => {
        let isMounted = true; // Prevent state updates after unmount
        let objectUrl = null;

        const loadImage = async () => {
            try {
                const imgUrl = await fetchImage(pet.imageName); // Fetch image URL
                if (isMounted && imgUrl) {
                    objectUrl = imgUrl;
                    setImageSrc(imgUrl);
                } else {
                    setError(true); // Handle missing image URL
                }
            } catch (err) {
                console.error('Image fetch failed:', err);
                setError(true); // Set error state on failure
            } finally {
                setLoading(false); // Stop loading regardless of outcome
            }
        };

        if (pet.imageName) loadImage(); // Trigger image load if name exists

        return () => {
            isMounted = false;
            if (objectUrl) URL.revokeObjectURL(objectUrl); // Cleanup on unmount
        };
    }, [pet.imageName]);

    const handleImageError = () => {
        setError(true); // Handle image load errors
        setLoading(false); // Stop spinner on error
    };

    return (
        <Card sx={{ width: '48%' }} elevation={4} key={pet.petName}>
            <CardContent>
                {loading ? (
                    <CircularProgress /> // Show loading spinner
                ) : error ? (
                    <Typography variant="body2">Image not available</Typography>
                ) : (
                    <img
                        src={imageSrc}
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
                )}
                {!loading && (
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
                )}
            </CardContent>
        </Card>
    );
};

export default PetCard;
