import axios from '@/utils/redux/axiosConfig';
import { API_URL } from '@/constants';
import { getSubjectFromToken } from '@/utils/redux/tokenUtils';

export const skewBySpecies = async (token, species) => {
    const url = `${API_URL}/api/recommendation-engine/skew-results`;
    const email = getSubjectFromToken(token);

    try {
        const response = await axios.post(url, null, {
            params: {
                email: email,
                species: species
            },
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}; 