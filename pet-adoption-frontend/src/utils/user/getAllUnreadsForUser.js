import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const getAllUnreadsForUser = async (token, userId) => {
    const response = await axios.post(
        `${API_URL}/api/conversation/getAllUnreadForUser`,
        null,
        {
            params: { userId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response;
};