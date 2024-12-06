import { Button, Box } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MessageIcon from '@mui/icons-material/Message';
import DeleteIcon from '@mui/icons-material/Delete';

const PetCardActions = ({
    saveable,
    likeable,
    authority,
    onSave,
    onLike,
    onContact,
    onDelete
}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
        }}>
            {saveable && (
                <Button
                    onClick={onSave}
                    variant="contained"
                    startIcon={<BookmarkIcon sx={{ fontSize: '1.2rem' }} />}
                    fullWidth
                    size="small"
                    sx={{
                        borderRadius: '6px',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                >
                    Save Pet
                </Button>
            )}
            {likeable && (
                <Button
                    onClick={onLike}
                    variant="outlined"
                    startIcon={<FavoriteIcon />}
                    fullWidth
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'secondary.main',
                        color: 'secondary.main',
                        '&:hover': {
                            borderColor: 'secondary.dark',
                            backgroundColor: 'secondary.50'
                        }
                    }}
                >
                    Like Pet
                </Button>
            )}
            {authority === "Owner" && (
                <Button
                    onClick={onContact}
                    variant="contained"
                    startIcon={<MessageIcon />}
                    fullWidth
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        bgcolor: 'success.main',
                        '&:hover': { bgcolor: 'success.dark' }
                    }}
                >
                    Contact Center
                </Button>
            )}
            {onDelete && (
                <Button
                    onClick={onDelete}
                    variant="outlined"
                    startIcon={<DeleteIcon />}
                    fullWidth
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'error.main',
                        color: 'error.main',
                        '&:hover': {
                            borderColor: 'error.dark',
                            backgroundColor: 'error.50'
                        }
                    }}
                >
                    Delete Pet
                </Button>
            )}
        </Box>
    );
};

export default PetCardActions; 