import { CardContent, Typography, CircularProgress, Box } from "@mui/material";
import ImageComponent from "@/components/imageComponent/ImageComponent";
import { useSelector } from "react-redux";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import ExpandedPetCard from "@/components/petCard/ExpandedPetCard";
import { StyledCard, BlurredContent, HoverOverlay, ImageWrapper, PetInfo, ActionButtons } from "./styles/PetCard.styles";
import PetCardActions from "./PetCardActions";
import { usePetCardHandlers } from "@/components/petCard/hooks/usePetCardHandlers";

const PetCard = ({
    pet,
    onClick,
    expandable = true,
    saveable = true,
    likeable = true,
    contactable = true,
    onLike = null,
    onDelete = null,
}) => {
    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);
    const authority = getAuthorityFromToken(token);

    const {
        loading,
        isHovered,
        isModalOpen,
        setLoading,
        setIsHovered,
        setIsModalOpen,
        handleSavePetToOwner,
        handleLikePet,
        handleContactCenter
    } = usePetCardHandlers(pet, token, email, onLike);

    if (authority !== "Owner") {
        saveable = false;
        likeable = false;
        contactable = false;
    }

    return (
        <Box sx={{ width: "330px", height: "500px" }}>
            <StyledCard
                onClick={onClick}
                elevation={0}
                key={pet.petName}
                isHovered={isHovered}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <BlurredContent isHovered={isHovered}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            mb: 1,
                            color: "text.primary"
                        }}
                    >
                        {pet.petName}
                    </Typography>

                    <ImageWrapper>
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
                                bgcolor="rgba(255, 255, 255, 0.8)"
                                zIndex={1}
                            >
                                <CircularProgress size={40} />
                            </Box>
                        )}
                        <ImageComponent
                            imageName={pet.imageName}
                            width="100%"
                            height="100%"
                            onLoad={() => setLoading(false)}
                        />
                    </ImageWrapper>

                    <PetInfo>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 500
                            }}
                        >
                            {pet.adoptionCenter?.centerName || "Adoption Center"}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "text.secondary"
                            }}
                        >
                            {pet.breed} • {pet.age} years
                        </Typography>
                    </PetInfo>
                </BlurredContent>

                <HoverOverlay className={isHovered ? "hovered" : ""}>
                    <Box
                        onClick={() => expandable && setIsModalOpen(true)}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5
                        }}
                    >
                        {["Species", "Breed", "Color", "Sex", "Age"].map((field) => (
                            <Typography
                                key={field}
                                variant="body1"
                                sx={{
                                    fontWeight: field === "Species" ? 600 : 400,
                                    opacity: 0.9
                                }}
                            >
                                {field}: {pet[field.toLowerCase()]}
                            </Typography>
                        ))}
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                opacity: 0.8,
                                lineHeight: 1.6
                            }}
                        >
                            {pet.description}
                        </Typography>
                    </Box>

                    <ActionButtons>
                        <PetCardActions
                            saveable={saveable}
                            likeable={likeable}
                            authority={authority}
                            onSave={handleSavePetToOwner}
                            onLike={handleLikePet}
                            onContact={handleContactCenter}
                            onDelete={onDelete ? () => onDelete(pet) : null}
                        />
                    </ActionButtons>
                </HoverOverlay>
            </StyledCard>

            {isModalOpen && (
                <ExpandedPetCard
                    pet={pet}
                    saveable={saveable}
                    likeable={likeable}
                    contactable={contactable}
                    onClose={() => setIsModalOpen(false)}
                    onLike={onLike}
                />
            )}
        </Box>
    );
};

export default PetCard;
