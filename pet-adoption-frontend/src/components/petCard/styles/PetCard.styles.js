import { styled, Card, Box } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "16px",
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
    }
}));

export const BlurredContent = styled(Box)(({ isHovered }) => ({
    transition: "all 0.3s ease",
    flexGrow: 1,
    padding: "16px",
    ...(isHovered && {
        filter: "blur(3px)",
    }),
}));

export const HoverOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "white",
    opacity: 0,
    transition: "opacity 0.3s ease",
    "&.hovered": {
        opacity: 1,
    },
}));

export const ImageWrapper = styled(Box)({
    position: "relative",
    width: "100%",
    height: "250px",
    overflow: "hidden",
    borderRadius: "8px",
    margin: "8px 0",
    "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.3s ease",
    },
});

export const PetInfo = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
});

export const ActionButtons = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "auto",
    "& button": {
        borderRadius: "8px",
        textTransform: "none",
        fontWeight: 600,
        padding: "8px 16px",
    }
})); 