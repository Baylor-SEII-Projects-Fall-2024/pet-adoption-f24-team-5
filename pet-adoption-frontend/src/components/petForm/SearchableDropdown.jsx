// SearchableDropdown.jsx
import React from 'react';
import { Autocomplete, TextField } from '@mui/material';

const SearchableDropdown = ({
                                label,
                                options = [],
                                value,
                                onChange,
                                inputValue = '',
                                onInputChange = () => {},
                                placeholder = '',
                                sx = { width: 300 },
                            }) => {
    return (
        <Autocomplete
            disablePortal
            options={options}
            value={value}
            inputValue={inputValue}
            onChange={(event, newValue) => onChange(newValue)}
            onInputChange={(event, newInputValue) => onInputChange(newInputValue)}
            sx={sx}

            renderInput={(params) => (
                <TextField {...params} label={label} placeholder={placeholder} />
            )}
        />
    );
};

export default SearchableDropdown;
