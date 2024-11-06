import {Card, CardContent, Typography, CircularProgress, Box, styled} from "@mui/material";
import ImageComponent from "@/components/ImageComponent";
import { useState } from "react";
import {theme} from "@/utils/theme";

const StyledCard = styled(Card)(({ theme, isHovered }) => ({
    position: 'relative',
    overflow: 'hidden',
    transition: '0.3s',
}));


const BlurredContent = styled(Box)(({ isHovered }) => ({
    transition: 'filter 0.3s',
    ...(isHovered && {
        filter: 'blur(2px)',
    }),
}));

const HoverOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.3s',
    '&.hovered': {
        opacity: 1,
    },
}));

const PetCard = ({ pet, onClick }) => {
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const handleImageLoad = () => {
        setLoading(false);
    };

    return (
        <StyledCard
            onClick={onClick}
            sx={{
                maxWidth: 600,
                maxHeight: 500,
                display: 'flex',
                justifyContent: 'center',
                "&:hover": {
                    border: "2px solid blue",
                },
            }}
            elevation={2}
            key={pet.petName}
            isHovered={isHovered}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <BlurredContent isHovered={isHovered}>
                <CardContent>
                    <Typography variant="h4" align="left">
                        {pet.petName}
                    </Typography>

                    <Box
                        position="relative"
                        width="100%"
                        height="auto"
                        margin="0 15px 15px 0"
                        justifyContent="left"
                        alignItems="center"
                    >
                        {loading && (
                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                position="absolute"
                                top={0}
                                left={0}
                                width="100%"
                                height="100%"
                                bgcolor="rgba(255, 255, 255, 0.6)"
                                zIndex={1}
                            >
                                <CircularProgress />
                            </Box>
                        )}

                        <ImageComponent
                            imageName={pet.imageName}
                            margin="auto"
                            width="100%"
                            height="auto"
                            onLoad={handleImageLoad} // Passing onLoad to ImageComponent.
                        />
                    </Box>
                </CardContent>
            </BlurredContent>
            <HoverOverlay className={isHovered ? 'hovered' : ''}>
                <Typography variant="h6" align="left">
                    Species: {pet.species}
                </Typography>
                <Typography variant="h6" align="left">
                    Breed: {pet.breed}
                </Typography>
                <Typography variant="h6" align="left">
                    Color: {pet.color}
                </Typography>
                <Typography variant="h6" align="left">
                    Age: {pet.age}
                </Typography>
                <Typography variant="body1" align="left">
                    Description: {pet.description}
                </Typography>
            </HoverOverlay>
        </StyledCard>
    );
};

export default PetCard;
