import axios from "axios";
import {API_URL} from "@/constants";

export const fetchImage = async (imageName) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`${API_URL}/api/images/${imageName}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return URL.createObjectURL(response.data);

    } catch (error) {
        console.error('Error fetching the image', error);
        return null;
    }
};