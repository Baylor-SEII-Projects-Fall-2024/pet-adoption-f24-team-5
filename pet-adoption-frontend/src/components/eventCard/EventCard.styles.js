import { styled } from "@mui/material/styles";
import { Card, Box } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: theme.shadows[4]
    }
}));

export const EventInfo = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    zIndex: 1
});

export const BlurredContent = styled(Box)(({ isHovered }) => ({
    transition: "all 0.3s ease",
    flexGrow: 1,
    padding: "28px",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,0.98))",
    backdropFilter: "blur(10px)",
    ...(isHovered && {
        filter: "blur(2px)",
    }),
}));

export const HoverOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: theme.spacing(3),
    background: "linear-gradient(45deg, rgba(0,0,0,0.8), rgba(0,0,0,0.7))",
    color: "white",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&.hovered": {
        opacity: 1,
    },
}));

export const DetailGrid = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
}));

export const DateTimeBox = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: theme.spacing(1),
}));

export const DetailItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: "8px",
    transition: "transform 0.2s ease",
    "& svg": {
        color: theme.palette.primary.main,
        fontSize: "1.1rem",
    },
    "&:hover": {
        transform: "translateY(-2px)",
    },
}));

export const LocationItem = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    borderRadius: "8px",
    "& svg": {
        color: theme.palette.primary.main,
        fontSize: "1.1rem",
        marginTop: "4px",
    },
})); 