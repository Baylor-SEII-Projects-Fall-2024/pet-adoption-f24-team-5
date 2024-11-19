import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const getPreferences = async (token, preferenceId) => {
    const response = await axios.get(`${API_URL}/api/preferences/get`, {
        params: {
            preferenceId: preferenceId,
        },
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};