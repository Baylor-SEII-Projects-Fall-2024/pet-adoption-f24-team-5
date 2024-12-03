import axios from '@/utils/redux/axiosConfig';
import { API_URL } from '@/constants';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';

export const engineUpdatePreference = async (token, preference) => {
    const url = `${API_URL}/api/recommendation-engine/update-preference`;
    const email = getSubjectFromToken(token);
    try {
        await axios.post(url, preference, {
            params: { email: email },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error(error);
    }
};
