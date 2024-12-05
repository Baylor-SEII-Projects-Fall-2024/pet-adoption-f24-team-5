import React from 'react';
import { Box, List, ListItem, ListItemText, Popover } from '@mui/material';

const HamburgerMenu = ({ anchorEl, open, onClose, onSelectSpecies }) => {
    const speciesOptions = ["Dog", "Cat", "Snake"]; // Add more species as needed

    return (
        <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            <Box sx={{ width: 200, p: 2 }}>
                <List>
                    {speciesOptions.map((species) => (
                        <ListItem button key={species} onClick={() => onSelectSpecies(species)}>
                            <ListItemText primary={species} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Popover>
    );
};

export default HamburgerMenu; 