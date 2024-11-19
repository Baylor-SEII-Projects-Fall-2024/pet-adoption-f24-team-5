import axios from 'axios';
import { API_URL } from '@/constants';

export const getOtherUserName = async (token, userType, conversationId) => {
    const url = `${API_URL}/api/conversation/getOtherUserName`;

    const response = await axios.post(
        url,
        null,
        {
            params: { t: userType, conversationId: conversationId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};
