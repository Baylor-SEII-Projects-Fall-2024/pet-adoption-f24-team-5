import React from 'react';
import { Box, List, ListItem, ListItemText, Popover, Divider } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PetsIcon from '@mui/icons-material/Pets';

const HamburgerMenu = ({ anchorEl, open, onClose, onSelectSpecies, onResetPreferences }) => {
    const speciesOptions = ["Dog", "Cat", "Bird"];

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <Box sx={{ width: 200 }}>
                <List>
                    {speciesOptions.map((species) => (
                        <ListItem
                            button
                            key={species}
                            onClick={() => {
                                onSelectSpecies(species);
                                onClose();
                            }}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}
                        >
                            <PetsIcon fontSize="small" />
                            <ListItemText primary={`Show more ${species}s`} />
                        </ListItem>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <ListItem
                        button
                        onClick={() => {
                            onResetPreferences();
                            onClose();
                        }}
                        sx={{
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <RestartAltIcon fontSize="small" />
                        <ListItemText primary="Reset Preferences" />
                    </ListItem>
                </List>
            </Box>
        </Popover>
    );
};

export default HamburgerMenu; 