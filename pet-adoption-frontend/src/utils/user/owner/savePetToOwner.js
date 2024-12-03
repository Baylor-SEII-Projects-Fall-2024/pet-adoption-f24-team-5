import axios from 'axios';
import { API_URL } from '@/constants';

export const savePetToOwner = async (token, formattedPet, email) => {
    const response = await axios.post(`${API_URL}/api/owner/save_pet_user`, formattedPet, {
        params: { email: email },
        headers: { Authorization: `Bearer ${token}` },
    }
    );

    return response.data;
};
