import React, { useState } from 'react';
import { TextField, Button, LinearProgress, Typography } from '@mui/material';
import axios from 'axios';
import { API_URL } from '@/constants';

const ImageUploadComponent = ({ onImageUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewSrc, setPreviewSrc] = useState(''); // Store preview image
    const token = localStorage.getItem('token');

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
            const response = await axios.post(
                `${API_URL}/api/images/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            console.log(response);
            if (onImageUpload) onImageUpload(response.data); // Call upload callback
        } catch (error) {
            console.error('Upload failed:', error);
            alert('An error occurred during upload. Please try again.');
        }
    };

    return (
        <div>
            <TextField
                type="file"
                onChange={handleFileSelect}
                fullWidth
                required
            />
            {previewSrc && (
                <img
                    src={previewSrc}
                    alt="Selected"
                    style={{ maxWidth: '200px', margin: '10px 0' }}
                />
            )}
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
