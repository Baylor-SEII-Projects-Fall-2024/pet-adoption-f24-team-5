import { styled, Box, Paper } from "@mui/material";

export const ModalContainer = styled(Paper)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '1200px',
    height: '90vh',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '24px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    '&:focus': {
        outline: 'none',
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        height: '90vh',
    },
}));

export const ImageSection = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '55%',
    height: '100%',
    backgroundColor: theme.palette.grey[100],
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '40%',
    },
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
    width: '45%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    [theme.breakpoints.down('md')]: {
        width: '100%',
        height: '60%',
    },
}));

export const ContentSection = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    height: '100%',
}));

export const PetDetails = styled(Box)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

export const ActionSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.divider}`,
    '& .primary-actions': {
        display: 'flex',
        gap: theme.spacing(2),
        '& > button': {
            flex: 1,
        }
    },
    '& .secondary-actions': {
        display: 'flex',
        gap: theme.spacing(2),
        '& > button': {
            flex: 1,
        }
    }
}));

export const DetailItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'center',
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    '& svg': {
        color: theme.palette.primary.main,
        fontSize: '1.5rem',
    },
}));

export const ImageControls = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    '& button': {
        flex: 1,
    },
})); 