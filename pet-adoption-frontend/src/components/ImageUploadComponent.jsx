import React, { useState } from 'react';
import { TextField, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import {API_URL} from "@/constants";

const ImageUploadComponent = ({ onImageUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const token = localStorage.getItem('token');

    const handleFileSelect = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = () => {

        if (!selectedFile) {
            console.log('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.post(`${API_URL}/api/images/upload`,
            formData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass token in the header
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            })
            .then(res => {
                console.log(res);
                if (onImageUpload) {
                    onImageUpload(res.data);
                }
            })
            .catch(err => {
                console.log(err);
                alert("An error occurred");
            });
    };

    return (
        <div>
            <TextField
                type="file"
                onChange={handleFileSelect}
                fullWidth
                required
            />
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleFileUpload}
                required
            >
                Upload
            </Button>
        </div>
    );
};

export default ImageUploadComponent;

