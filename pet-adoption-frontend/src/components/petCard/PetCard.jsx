import React, { useState, useEffect } from 'react';
import { CardContent, Typography, Box, Button } from "@mui/material";
import ImageComponent from "@/components/imageComponent/ImageComponent";
import { StyledCard, ImageWrapper, PetInfo } from "./styles/PetCard.styles";
import PetCardActions from "./PetCardActions";
import { usePetCardHandlers } from "./hooks/usePetCardHandlers";
import { useSelector } from "react-redux";
import { getSubjectFromToken, getAuthorityFromToken } from "@/utils/redux/tokenUtils";
import ExpandedPetCard from './ExpandedPetCard';
import EditIcon from '@mui/icons-material/Edit';
import MessageIcon from '@mui/icons-material/Message';
import BookmarkAdd from '@mui/icons-material/BookmarkAdd';
import Favorite from '@mui/icons-material/Favorite';

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
    isManagerView = false,
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
                elevation={1}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                size={size}
            >
                <ImageWrapper size={size} onClick={expandable ? handleCardClick : null} sx={{ cursor: expandable ? 'pointer' : 'default' }}>
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
                                fontSize: size === 'large' ? '1.25rem' : '1rem',
                                color: 'text.primary'
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
                                        bgcolor: 'secondary.light',
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: '12px',
                                        fontSize: '0.75rem',
                                        color: 'text.primary',
                                        border: '1px solid',
                                        borderColor: 'secondary.main'
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

                    {/* Actions Section */}
                    <Box sx={{ mt: 'auto' }}>
                        {/* Main Actions */}
                        {isManagerView ? (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                startIcon={<EditIcon />}
                                onClick={onClick}
                                sx={{
                                    borderRadius: '24px',
                                    py: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    }
                                }}
                            >
                                Edit Pet Details
                            </Button>
                        ) : (
                            <PetCardActions
                                saveable={saveable}
                                contactable={contactable}
                                likeable={likeable}
                                authority={authority}
                                onSave={handleSavePetToOwner}
                                onLike={handleLikePet}
                                onContact={handleContactCenter}
                                onDelete={onDelete ? () => onDelete(pet) : null}
                            />
                        )}
                    </Box>
                </PetInfo>
            </StyledCard >

            {expandable && isExpanded && (
                <ExpandedPetCard
                    pet={pet}
                    onClose={() => setIsExpanded(false)}
                    saveable={saveable}
                    likeable={likeable}
                    contactable={contactable}
                    onLike={onLike}
                />
            )
            }
        </>
    );
};

export default PetCard;
