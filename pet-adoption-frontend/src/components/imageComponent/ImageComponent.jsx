import React, { useState, useEffect } from 'react';
import { fetchImage } from '@/utils/image/fetchImage';
import { Skeleton } from '@mui/material';
import { useSelector } from "react-redux";

const ImageComponent = ({ imageName, width, height, style = {} }) => {
    const [imageType, setImageType] = useState("");
    const [imageData, setImageData] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        setIsLoading(true);
        setImageData("");
        setImageType("");

        const loadImage = async () => {
            try {
                const { imageType: fetchedImageType, imageData: fetchedImageData } =
                    await fetchImage(imageName, token);
                setImageType(fetchedImageType);
                setImageData(fetchedImageData);
            } catch (error) {
                console.error('Error loading image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (imageName) {
            loadImage();
        }
    }, [imageName, token]);

    if (isLoading) {
        return (
            <Skeleton
                variant="rectangular"
                width={width}
                height={height}
                animation="wave"
            />
        );
    }

    return (
        <img
            src={`data:${imageType};base64,${imageData}`}
            alt=""
            style={{
                ...style,
                width,
                height,
                display: 'block'
            }}
            onLoad={() => setIsLoading(false)}
        />
    );
};

export default ImageComponent;
