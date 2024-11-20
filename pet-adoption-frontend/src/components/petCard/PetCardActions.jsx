import { Button } from "@mui/material";
import { ActionButtons } from "./styles/PetCard.styles";
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
        <ActionButtons>
            {saveable && (
                <Button
                    onClick={onSave}
                    variant="contained"
                    startIcon={<BookmarkIcon />}
                    sx={{
                        bgcolor: 'primary.main',
                        '&:hover': { bgcolor: 'primary.dark' }
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
                        bgcolor: 'secondary.main',
                        '&:hover': { bgcolor: 'secondary.dark' }
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
                    sx={{
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
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    sx={{
                        bgcolor: 'error.main',
                        '&:hover': { bgcolor: 'error.dark' }
                    }}
                >
                    Delete Pet
                </Button>
            )}
        </ActionButtons>
    );
};

export default PetCardActions; 