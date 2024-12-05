import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const getCenterEvents = async (token, email) => {
    const response = await axios.get(`${API_URL}/api/events/getCenterEvents/${email}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};