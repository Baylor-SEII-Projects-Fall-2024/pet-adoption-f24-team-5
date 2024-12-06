import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Box } from "@mui/material";
import ImageComponent from "@/components/imageComponent/ImageComponent";
import { StyledCard, ImageWrapper, PetInfo } from "./styles/PetCard.styles";
import PetCardActions from "./PetCardActions";
import { usePetCardHandlers } from "./hooks/usePetCardHandlers";
import { useSelector } from "react-redux";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import ExpandedPetCard from './ExpandedPetCard';

const PetCard = ({
    pet,
    onClick,
    expandable = true,
    saveable = true,
    likeable = true,
    contactable = true,
    onLike = null,
    onDelete = null,
    size = 'default',
}) => {
    const token = useSelector((state) => state.user.token);
    const email = getSubjectFromToken(token);
    const authority = getAuthorityFromToken(token);

    // Adjust permissions based on authority
    if (authority !== "Owner") {
        saveable = false;
        likeable = false;
        contactable = false;
    }

    const {
        loading,
        isHovered,
        setIsHovered,
        handleSavePetToOwner,
        handleLikePet,
        handleContactCenter
    } = usePetCardHandlers(pet, token, email, onLike);

    const [isExpanded, setIsExpanded] = useState(false);
    const [imageKey, setImageKey] = useState(pet.id);

    // Update imageKey when pet changes
    useEffect(() => {
        setImageKey(pet.id + Date.now());
    }, [pet.id]);

    const handleCardClick = (e) => {
        if (expandable && !e.target.closest('.MuiButtonBase-root')) {
            setIsExpanded(true);
        }
        if (onClick) onClick(e);
    };

    return (
        <>
            <StyledCard
                onClick={handleCardClick}
                elevation={1}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                size={size}
                sx={{ cursor: expandable ? 'pointer' : 'default' }}
            >
                <ImageWrapper size={size}>
                    <ImageComponent
                        key={imageKey}
                        imageName={pet.imageName}
                        width="100%"
                        height="100%"
                        style={{
                            objectFit: 'cover',
                            opacity: 1,
                            transition: 'opacity 0.2s ease-in-out'
                        }}
                    />
                </ImageWrapper>

                <PetInfo>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                mb: 0.5,
                                fontSize: size === 'large' ? '1.25rem' : '1rem'
                            }}
                        >
                            {pet.petName}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                mb: 1,
                                fontWeight: 500,
                                fontSize: '0.875rem'
                            }}
                        >
                            {pet.adoptionCenter?.centerName}
                        </Typography>

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                            mb: 1
                        }}>
                            {[
                                { label: pet.breed },
                                { label: pet.sex },
                                { label: `${pet.age} years` }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        bgcolor: 'action.hover',
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        color: 'text.primary'
                                    }}
                                >
                                    {item.label}
                                </Box>
                            ))}
                        </Box>

                        {/* Only show description for default size cards */}
                        {size === 'default' && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.4,
                                    fontSize: '0.875rem'
                                }}
                            >
                                {pet.description}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ mt: 'auto' }}>
                        <PetCardActions
                            saveable={saveable}
                            likeable={likeable}
                            authority={authority}
                            onSave={handleSavePetToOwner}
                            onLike={handleLikePet}
                            onContact={handleContactCenter}
                            onDelete={onDelete ? () => onDelete(pet) : null}
                        />
                    </Box>
                </PetInfo>
            </StyledCard>

            {expandable && isExpanded && (
                <ExpandedPetCard
                    pet={pet}
                    onClose={() => setIsExpanded(false)}
                    saveable={saveable}
                    likeable={likeable}
                    contactable={contactable}
                    onLike={onLike}
                />
            )}
        </>
    );
};

export default PetCard;
