import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const getSavedPets = async (token, email) => {
    try {
        const res = await axios.get(`${API_URL}/api/owner/get_saved_pets`, {
            params: { email: email },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};