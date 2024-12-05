import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    Stack,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import MapIcon from '@mui/icons-material/Map';
import { useNavigate } from 'react-router-dom';

const AdoptionCenterCard = ({ center, distance, onClick }) => {
    const navigate = useNavigate();

    const handleViewPets = () => {
        navigate(`/AvailablePets?centerId=${center.id}`);
    };

    const handleViewEvents = () => {
        // navigate(`/Events?centerId=${center.id}`);
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8],
                }
            }}
        >
            <CardContent sx={{ pb: '16px !important', flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: 'medium',
                            color: 'primary.main',
                            pr: 1
                        }}
                    >
                        {center.centerName}
                    </Typography>
                    <Tooltip title="View on map">
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.(center);
                            }}
                            sx={{
                                bgcolor: 'action.selected',
                                '&:hover': { bgcolor: 'action.focus' }
                            }}
                        >
                            <MapIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Stack spacing={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <LocationOnIcon color="action" fontSize="small" />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ lineHeight: 1.4 }}
                        >
                            {center.centerAddress},<br />
                            {center.centerCity}, {center.centerState} {center.centerZip}
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                        <PetsIcon color="primary" fontSize="small" />
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'medium'
                            }}
                        >
                            {center.numberOfPets} pets available
                        </Typography>
                    </Box>

                    <Box display="flex" gap={1} alignItems="center">
                        <EventIcon color="primary" fontSize="small" />
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 'medium'
                            }}
                        >
                            upcoming events
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        {distance && (
                            <Chip
                                label={`${distance.toFixed(1)} miles away`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{
                                    borderRadius: 1.5,
                                    '& .MuiChip-label': {
                                        px: 1
                                    }
                                }}
                            />
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleViewPets}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                minWidth: '120px'
                            }}
                        >
                            View Pets
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleViewEvents}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                minWidth: '120px'
                            }}
                        >
                            View Events
                        </Button>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default AdoptionCenterCard;