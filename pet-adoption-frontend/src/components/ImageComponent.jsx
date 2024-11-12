import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchImage } from "@/utils/fetchImage";

const ImageComponent = (props) => {
    const [imageType, setImageType] = useState("");
    const [imageData, setImageData] = useState("");
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const { imageType: fetchedImageType, imageData: fetchedImageData } =
                    await fetchImage(props.imageName, token);
                setImageType(fetchedImageType);
                setImageData(fetchedImageData);
            } catch (err) {
                console.error("Image fetch failed:", err);
            }
        };

        if (props.imageName) loadImage();
    }, [props.imageName, token]);

    return (
        <img
            src={`data:${imageType};base64,${imageData}`}
            alt="Pet"
            style={{
                float: props.float,
                margin: props.margin,
                width: props.width,
                maxWidth: props.maxWidth,
                height: props.height,
                align: props.align,
            }}
            onLoad={props.onLoad}
        />
    );
};

export default ImageComponent;
