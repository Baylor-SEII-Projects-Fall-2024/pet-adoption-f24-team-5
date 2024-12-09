import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const getAllPets = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/api/pets/adoptable`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response:", error.response);
        } else if (error.request) {
            console.error("Error request:", error.request);
        } else {
            console.error("Error message:", error.message);
        }
        throw error;
    }
};