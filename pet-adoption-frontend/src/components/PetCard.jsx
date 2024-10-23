import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import ImageComponent from "@/components/ImageComponent";
import { useState } from "react";

const PetCard = ({ pet, onClick }) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    };

    return (
        <Card
            onClick={onClick}
            sx={{
                width: "48%",
                "&:hover": {
                    border: "2px solid blue",
                },
            }}
            elevation={2}
            key={pet.petName}
        >
            <CardContent>
                <Box
                    position="relative"
                    width="100%"
                    maxWidth="200px"
                    height="auto"
                    margin="0 15px 15px 0"
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
                        width="100%"
                        maxWidth="200px"
                        height="auto"
                        onLoad={handleImageLoad} // Passing onLoad to ImageComponent.
                    />
                </Box>

                <Typography variant="h4" align="left">
                    {pet.petName}
                </Typography>
                <Typography variant="body2" align="left">
                    Species: {pet.species}
                </Typography>
                <Typography variant="body2" align="left">
                    Breed: {pet.breed}
                </Typography>
                <Typography variant="body2" align="left">
                    Color: {pet.color}
                </Typography>
                <Typography variant="body2" align="left">
                    Age: {pet.age}
                </Typography>
                <Typography variant="body2" align="left">
                    Description: {pet.description}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default PetCard;
