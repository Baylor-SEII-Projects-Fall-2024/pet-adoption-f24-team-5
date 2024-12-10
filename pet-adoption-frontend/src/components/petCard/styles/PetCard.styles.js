import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

export const StyledCard = styled(Card)(({ theme, size }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: size === 'large' ? '500px' : '400px',
    position: 'relative',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        boxShadow: theme.shadows[4]
    }
}));

export const ImageWrapper = styled('div')(({ size }) => ({
    position: 'relative',
    width: '100%',
    height: size === 'large' ? '300px' : '200px',
    overflow: 'hidden',
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease-in-out',
    },
}));

export const PetInfo = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    flex: 1,
    justifyContent: 'space-between'
}); 