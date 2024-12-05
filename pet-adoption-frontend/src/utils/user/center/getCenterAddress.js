import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const getCenterAddress = async (token, centerId) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/getAdoptionCenter/${centerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch adoption center address:", error);
        return null;
    }
};