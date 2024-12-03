import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const getCenters = async (token) => {
    const response = await axios.get(`${API_URL}/api/users/adoptioncenters`, {
        headers: {
            Authorization: `Bearer ${token}`, // Pass token in the header
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};