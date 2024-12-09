import axios from '@/utils/redux/axiosConfig';
import { API_URL } from '@/constants';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';

export const resetRecommendation = async (token) => {
    const url = `${API_URL}/api/recommendation-engine/reset-engine`;
    const email = getSubjectFromToken(token);

    try {
        await axios.post(url, null, {
            params: { email: email },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error(error);
    }
};
