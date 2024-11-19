import axios from 'axios';
import { API_URL } from '@/constants';

export const startConversation = async (token, userId, centerID) => {
    const url = `${API_URL}/api/conversation/startConversation`;

    const response = await axios.post(
        url,
        null,
        {
            params: {
                petOwnerID: userId,
                centerID: centerID,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
