import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const getCenterName = async (token, centerId) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/getAdoptionCenter/${centerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.centerName; // Assuming the response contains the name
    } catch (error) {
        console.error("Failed to fetch adoption center name:", error);
        return "Unknown Center"; // Default value in case of an error
    }
};