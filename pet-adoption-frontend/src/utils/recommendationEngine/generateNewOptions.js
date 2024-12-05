import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";

export const generateNewOptions = async (token) => {
    const email = getSubjectFromToken(token);

    const url = `${API_URL}/api/recommendation-engine/generate-new-options`;
    try {
        const response = await axios.get(url, {
            params: { email: email },
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in the header
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};