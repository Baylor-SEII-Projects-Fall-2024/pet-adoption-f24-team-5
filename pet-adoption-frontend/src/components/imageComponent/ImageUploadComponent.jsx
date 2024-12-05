import React, { useState } from 'react';
import { TextField, Button, LinearProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { uploadImage } from '@/utils/image/uploadImage';
const ImageUploadComponent = ({ onImageUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewSrc, setPreviewSrc] = useState(''); // Store preview image
    const [sizeError, setSizeError] = useState(false);
    const token = useSelector((state) => state.user.token);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewSrc(URL.createObjectURL(file)); // Generate preview URL
        } else {
            alert('Please select a valid image file.');
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await uploadImage(token, formData, setUploadProgress);
            if (onImageUpload) onImageUpload(response);
        } catch (error) {
            console.error('Upload failed:', error);
            if (error.response && error.response.status === 400) {
                setSizeError(true);
            } else {
                alert('An error occurred during upload. Please try again.');
            }
        }
    };

    return (
        <div>
            <TextField
                type="file"
                onChange={handleFileSelect}
                fullWidth
            />
            {previewSrc && (
                <img
                    src={previewSrc}
                    alt="Selected"
                    style={{ maxWidth: '200px', margin: '10px 0' }}
                />
            )}
            {sizeError && <Typography color="error">File size exceeds the 5MB limit.</Typography>}
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                disabled={!selectedFile}
            >
                Upload
            </Button>
        </div>
    );
};

export default ImageUploadComponent;
