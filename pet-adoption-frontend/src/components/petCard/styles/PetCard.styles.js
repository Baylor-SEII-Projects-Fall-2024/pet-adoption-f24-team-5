import { styled, Card, Box } from "@mui/material";

export const StyledCard = styled(Card)(({ theme, size = 'default' }) => ({
    height: size === 'large' ? '530px' : '380px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
    overflow: 'hidden',
    border: `1px solid ${theme.palette.divider}`,
    margin: '0 auto',

    ...(size === 'default' && {
        maxWidth: '300px',
    }),

    ...(size === 'large' && {
        maxWidth: '450px',
    }),

    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4]
    }
}));

export const ImageWrapper = styled(Box)(({ size = 'default' }) => ({
    position: 'relative',
    width: '100%',
    height: size === 'large' ? '300px' : '200px',
    overflow: 'hidden',

    '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'transform 0.3s ease'
    },

    '&:hover img': {
        transform: 'scale(1.05)'
    }
}));

export const PetInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '16px',
    justifyContent: 'space-between'
}); 