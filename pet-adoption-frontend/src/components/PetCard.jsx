import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ImageComponent from "@/components/ImageComponent";
import {useState} from "react";

const PetCard = ({ pet, onClick }) => {
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setLoading(false);
    }

    return (
        <Card onClick={onClick}
              sx={{ width: '48%',
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': {
                    border: '2px solid blue',
                    },}}
              elevation={4}
              key={pet.petName}>

            <CardContent>
                <ImageComponent
                    imageName={pet.imageName}
                    margin='0 15px 15px 0'
                    width='100%'
                    maxWidth='200px'
                    height='auto'
                    onLoad={handleImageLoad}
                />

                    <>
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
                    </>
            </CardContent>
        </Card>
    );
};

export default PetCard;
