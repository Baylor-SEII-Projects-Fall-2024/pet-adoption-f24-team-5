import { Button, Box } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';

const PetCardActions = ({
    saveable,
    likeable,
    contactable,
    authority,
    onSave,
    onLike,
    onContact,
    onDelete
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {/* Save and Like buttons row */}
            {(saveable || likeable) && (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: saveable && likeable ? '1fr 1fr' : '1fr',
                    gap: 1
                }}>
                    {saveable && (
                        <Button
                            onClick={onSave}
                            variant="contained"
                            startIcon={<BookmarkIcon />}
                            sx={{
                                borderRadius: '24px',
                                py: 1.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }}
                        >
                            Save Pet
                        </Button>
                    )}

                    {likeable && (
                        <Button
                            onClick={onLike}
                            variant="contained"
                            startIcon={<FavoriteIcon />}
                            sx={{
                                borderRadius: '24px',
                                py: 1.5,
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                }
                            }}
                        >
                            Like Pet
                        </Button>
                    )}
                </Box>
            )}

            {/* Contact Center button */}
            {contactable && (
                <Button
                    onClick={onContact}
                    variant="contained"
                    startIcon={<MessageIcon />}
                    sx={{
                        borderRadius: '24px',
                        py: 1.5,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        }
                    }}
                >
                    Contact Center
                </Button>
            )}

            {/* Remove from Saved button */}
            {onDelete && (
                <Button
                    onClick={onDelete}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    sx={{
                        borderRadius: '24px',
                        py: 1.5,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'primary.50',
                        }
                    }}
                >
                    Remove from Saved
                </Button>
            )}
        </Box>
    );
};

export default PetCardActions; 