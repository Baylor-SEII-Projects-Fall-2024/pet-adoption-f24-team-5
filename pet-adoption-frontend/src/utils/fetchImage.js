import axios from "axios";

export const fetchImage = async (imageName) => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`http://localhost:8080/api/images/${imageName}`, {
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