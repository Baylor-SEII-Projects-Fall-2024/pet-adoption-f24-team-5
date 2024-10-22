import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ImageComponent from "@/components/ImageComponent";

const PetCard = ({ pet, onClick }) => {


    return (
        <Card onClick={onClick}
              sx={{ width: '48%',
                    backgroundColor: 'white',
                    transition: 'border 0.3s',
                    '&:hover': {
                    border: '2px solid blue',
                    },}} elevation={4} key={pet.petName}>
            <CardContent>
                   <ImageComponent
                       imageName={pet.imageName}
                       float='left'
                       margin='0 15px 15px 0'
                       width='100%'
                       maxWidth='200px'
                       height='auto'
                   />
                    <>
                        <Typography variant="h4" align="left">
                            {pet.petName}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.species}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.breed}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.color}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.age}
                        </Typography>
                        <Typography variant="body2" align="left">
                            {pet.description}
                        </Typography>
                    </>
            </CardContent>
        </Card>
    );
};

export default PetCard;
