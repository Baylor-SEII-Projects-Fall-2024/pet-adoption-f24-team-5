import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import ImageComponent from './ImageComponent';

const ExpandedPetCard = ({ pet, onClose }) => {
    return (
        <Modal open={!!pet} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 4,
                    backgroundColor: 'white',
                    borderRadius: 2
                }}
            >
                <ImageComponent
                    imageName={pet.imageName}
                    width="100%"
                    maxWidth="200px"
                    height="auto"
                />
                <Typography variant="h4">{pet.petName}</Typography>
                <Typography variant="body1">Species: {pet.species}</Typography>
                <Typography variant="body1">Breed: {pet.breed}</Typography>
                <Typography variant="body1">Color: {pet.color}</Typography>
                <Typography variant="body1">Sex: {pet.sex}</Typography>
                <Typography variant="body1">Age: {pet.age}</Typography>
                <Typography variant="body1">Description: {pet.description}</Typography>
                <Button onClick={onClose}>Close</Button>
            </Box>
        </Modal>
    );
};

export default ExpandedPetCard;
