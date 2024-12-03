import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";

export const getAllPets = async (token) => {
    const url = `${API_URL}/api/pets/center?email=${getSubjectFromToken(token)}`;

    try {
        const res = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in the header
                'Content-Type': 'application/json'
            },
        });
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};