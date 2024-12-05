import axios from 'axios';
import { API_URL } from '@/constants';

export const getMessages = async (token, conversationId, userId) => {
    try {
        const response = await axios.post(
            `${API_URL}/api/message/getMessages`,
            null,
            {
                params: { conversationId, userId },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};
