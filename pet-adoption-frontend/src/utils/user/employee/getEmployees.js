import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const getEmployees = async (token, id) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/adoption-center/getEmployees/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (err) {
        console.error('Failed to fetch employees:', err);
    }
}