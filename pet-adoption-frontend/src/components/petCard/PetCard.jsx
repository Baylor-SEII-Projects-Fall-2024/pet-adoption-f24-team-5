import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Button,
    styled,
} from "@mui/material";
import ImageComponent from "@/components/imageComponent/ImageComponent";
import { useState } from "react";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import { useSelector } from "react-redux";
import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";
import ExpandedPetCard from "@/components/petCard/ExpandedPetCard";
import { useNavigate } from "react-router-dom";
import { savePetToOwner } from "@/utils/user/owner/savePetToOwner";
import { engineUpdatePreference } from "@/utils/recommendationEngine/engineUpdatePreference";
import { getUser } from "@/utils/user/getUser";
import { startConversation } from "@/utils/message/startConversation";


const StyledCard = styled(Card)(({ theme, isHovered }) => ({
    position: "relative",
    overflow: "hidden",
    transition: "0.3s",
}));

const BlurredContent = styled(Box)(({ isHovered }) => ({
    transition: "filter 0.3s",
    ...(isHovered && {
        filter: "blur(2px)",
    }),
}));

const HoverOverlay = styled(Box)(({ theme }) => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    opacity: 0,
    transition: "opacity 0.3s",
    "&.hovered": {
        opacity: 1,
    },
}));

const PetCard = ({
    pet,
    onClick,
    expandable = true,
    saveable = true,
    likeable = true,
    onLike = null,
    onDelete = null,
}) => {
    const [loading, setLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);
    const authority = getAuthorityFromToken(token);
    const navigate = useNavigate();

    if (authority !== "Owner") {
        saveable = false;
        likeable = false;
    }

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleSavePetToOwner = async () => {
        const formattedPet = {
            petId: pet.petId,
            petOwner: pet.petOwner,
            species: pet.species,
            petName: pet.petName,
            breed: pet.breed,
            color: pet.color,
            sex: pet.sex,
            age: pet.age,
            adoptionStatus: pet.adoptionStatus,
            description: pet.description,
            imageName: pet.imageName,
            owner: pet.owner,
            petWeightId: pet.petWeightId,
        };
        try {
            await savePetToOwner(token, formattedPet, email);
        } catch (error) {
            console.error(error);
        }
    };

    const handleExpandClick = () => {
        if (expandable) {
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleLikePet = async () => {
        const preference = {
            preferredSpecies: pet.species,
            preferredBreed: pet.breed,
            preferredColor: pet.color,
            preferredAge: pet.age,
        };
        try {
            await engineUpdatePreference(token, preference);
            if (onLike) {
                onLike(pet);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Function to fetch user data
    const fetchUser = async () => {
        try {
            const response = await getUser(token, email);
            // Return the user data
            return response;
        } catch (error) {
            console.error("Failed to fetch user", error);
            throw error;
        }
    };

    // Function to handle contacting the adoption center
    const handleContactCenter = async () => {
        console.log("Pet data:", pet); // Log the pet object for debugging
        try {
            // Fetch user data to get userId
            const userData = await fetchUser();
            const userId = userData.id;

            // Retrieve centerID from the adoptionCenter field
            const centerID = pet.adoptionCenter?.id;

            if (!centerID) {
                console.error("Center ID not found in pet data");
                alert("Unable to contact the adoption center. Please try again later.");
                return;
            }

            const response = await startConversation(token, userId, centerID);

            console.log("Conversation started:", response);

            // Navigate to the Messages page
            navigate("/Messages");
        } catch (error) {
            console.error("Failed to start conversation", error);
        }
    };

    // Extract the Adoption Center's name
    const adoptionCenterName = pet.adoptionCenter?.centerName || "Adoption Center";

    return (
        <Box
            sx={{
                width: "330px",
                height: "600px",
            }}
        >
            <StyledCard
                onClick={onClick}
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
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
                <BlurredContent isHovered={isHovered} sx={{ flexGrow: 1 }}>
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
                                width="100%"
                                maxWidth="200px"
                                height="auto"
                                onLoad={handleImageLoad}
                            />
                        </Box>

                        {/* Display Adoption Center's Name */}
                        <Typography variant="h6" align="left">
                            Center: {adoptionCenterName}
                        </Typography>
                    </CardContent>
                </BlurredContent>
                <HoverOverlay className={isHovered ? "hovered" : ""}>
                    <Box onClick={handleExpandClick} sx={{ cursor: "pointer" }}>
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
                            Sex: {pet.sex}
                        </Typography>
                        <Typography variant="h6" align="left">
                            Age: {pet.age}
                        </Typography>
                        <Typography variant="body1" align="left">
                            Description: {pet.description}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        gap={1}
                    >
                        {saveable && (
                            <Button
                                onClick={handleSavePetToOwner}
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Save Pet
                            </Button>
                        )}
                        {likeable && (
                            <Button
                                onClick={handleLikePet}
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Like Pet
                            </Button>
                        )}
                        {authority === "Owner" && (
                            <Button
                                onClick={handleContactCenter}
                                variant="contained"
                                color="secondary"
                                fullWidth
                            >
                                Contact Adoption Center
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                onClick={() => onDelete(pet)} // This calls the parent function to delete the pet
                                variant="contained"
                                color="error"
                                fullWidth
                            >
                                Delete Pet
                            </Button>
                        )}
                    </Box>
                </HoverOverlay>
            </StyledCard>

            {isModalOpen && (
                <ExpandedPetCard
                    pet={pet}
                    saveable={saveable}
                    likeable={likeable}
                    onClose={handleCloseModal}
                    onLike={onLike}
                />
            )}
        </Box>
    );
};

export default PetCard;
