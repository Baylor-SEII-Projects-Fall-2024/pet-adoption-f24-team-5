import axios from "../redux/axiosConfig";
import { API_URL } from "@/constants";
import { useSelector } from 'react-redux';

export const fetchImage = async (imageName, token) => {

    try {
        console.log(imageName)
        const response = await axios.get(`${API_URL}/api/images/${imageName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const imageType = Object.keys(response.data)[0];
        const imageData = response.data[imageType];

        return {
            imageType,
            imageData,
        };
    } catch (error) {
        console.error(error);
        throw error;

    }


};