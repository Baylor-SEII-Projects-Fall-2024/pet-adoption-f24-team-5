import axios from '@/utils/redux/axiosConfig';
import { API_URL } from '@/constants';

export const getAvailableSpecies = async () => {
    const url = `${API_URL}/api/pets/available-species`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}; 