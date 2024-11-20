import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';

const AdoptionCenterCard = ({ center, distance }) => {
    return (
        <Card
            elevation={3}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom component="div">
                    {center.centerName}
                </Typography>

                <Stack spacing={1.5}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LocationOnIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {center.centerAddress}, {center.centerCity}, {center.centerState} {center.centerZip}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        <PetsIcon color="action" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {center.centerPetCount} pets available
                        </Typography>
                    </Box>

                    {distance && (
                        <Chip
                            label={`${distance.toFixed(1)} miles away`}
                            size="small"
                            color="primary"
                            sx={{ alignSelf: 'flex-start' }}
                        />
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AdoptionCenterCard;