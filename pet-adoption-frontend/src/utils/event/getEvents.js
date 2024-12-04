import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const getEvents = async (token) => {
    const response = await axios.get(`${API_URL}/api/events`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};