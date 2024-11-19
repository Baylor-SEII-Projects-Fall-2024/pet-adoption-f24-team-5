import axios from 'axios';
import { API_URL } from '@/constants';

export const getAllConversations = async (token, userId) => {
    const url = `${API_URL}/api/conversation/getAllConversations`;

    const response = await axios.post(
        url,
        null,
        {
            params: { userId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
