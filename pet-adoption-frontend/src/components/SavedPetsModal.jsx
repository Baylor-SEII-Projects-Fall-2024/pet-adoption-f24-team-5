import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Modal, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PetCard from "@/components/petCard/PetCard";
import { useSelector } from 'react-redux';
import { getSavedPets } from '../utils/user/owner/GetSavedPets';
import { removeSavedPet } from '../utils/user/owner/RemoveSavedPets';
import { getSubjectFromToken } from '../utils/redux/tokenUtils';

const SavedPetsModal = ({ open, onClose }) => {
    const token = useSelector((state) => state.user.token);
    const [email, setEmail] = useState(getSubjectFromToken(token));
    const [savedPets, setSavedPets] = useState([]);

    const fetchSavedPets = async () => {
        try {
            const pets = await getSavedPets(token, email);
            setSavedPets(pets);
        } catch (error) {
            console.error('Error fetching saved pets:', error);
        }
    };

    const handleDeletePet = async (petToDelete) => {
        try {
            await removeSavedPet(petToDelete, token, email);
            await fetchSavedPets();
        } catch (error) {
            console.error('Error deleting pet:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchSavedPets();
        }
    }, [open, token, email]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box sx={{
                position: 'relative',
                backgroundColor: 'background.paper',
                width: '90%',
                maxWidth: '1400px',
                maxHeight: '90vh',
                borderRadius: '16px',
                boxShadow: 24,
                display: 'flex',
                flexDirection: 'column',
            }}>
                {/* Header */}
                <Box sx={{
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Saved Pets
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{
                    p: 3,
                    overflowY: 'auto',
                    flexGrow: 1,
                }}>
                    {savedPets.length > 0 ? (
                        <Grid container spacing={3}>
                            {savedPets.map((pet) => (
                                <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                    <PetCard
                                        pet={pet}
                                        likeable={false}
                                        saveable={false}
                                        expandable={true}
                                        contactable={true}
                                        onDelete={() => handleDeletePet(pet)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 8,
                            gap: 2
                        }}>
                            <Typography variant="h6" color="text.secondary">
                                No saved pets yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Start browsing and save pets you're interested in!
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={onClose}
                                sx={{ mt: 2 }}
                            >
                                Browse Pets
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default SavedPetsModal; 