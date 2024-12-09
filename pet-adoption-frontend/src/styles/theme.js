import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

// This file lets you modify the global theme of your project. Any changes here will affect all
// Material UI components throughout your website. Correspondingly, this is where you would set
// up your color palette, standard spacings, etc.
const themeOptions = {
    palette: {
        primary: {
            main: '#8B7355', // warm brown from the logo outline
            light: '#A68B73',
            dark: '#6B563E',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#D4C4B7', // beige/cream color from the logo
            light: '#E8DED6',
            dark: '#BBA89A',
            contrastText: '#000000',
        },
        background: {
            default: '#FAF7F5', // very light cream
            paper: '#ffffff',
        },
        text: {
            primary: '#2C1810', // dark brown
            secondary: '#5C4033', // medium brown
        }
    },
    typography: {
        fontFamily: 'Roboto, Noto Sans, sans-serif',
        fontSize: 14,
        body2: {
            fontSize: 14
        }
    },
    shape: {
        borderRadius: 12, // increased for a softer look
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    margin: '8px',
                    borderRadius: '24px', // pill-shaped buttons
                    padding: '8px 24px',
                },
                outlinedPrimary: {
                    border: '2px solid',
                    '&:hover': {
                        border: '2px solid',
                    }
                },
                outlinedSecondary: {
                    border: '2px solid',
                    '&:hover': {
                        border: '2px solid',
                    }
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(139,115,85,0.15)' // brown-tinted shadow
                    }
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    '&:focus': {
                        backgroundColor: 'transparent'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    border: '1px solid #E8DED6', // light beige border
                }
            }
        }
    }
};

export const theme = createTheme(themeOptions);

export const PetAdoptionThemeProvider = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};