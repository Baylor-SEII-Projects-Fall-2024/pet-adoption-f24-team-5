import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const updatePreferences = async (token, preferences, preferenceId) => {
    const response = await axios.put(`${API_URL}/api/preferences/update`, preferences, {
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