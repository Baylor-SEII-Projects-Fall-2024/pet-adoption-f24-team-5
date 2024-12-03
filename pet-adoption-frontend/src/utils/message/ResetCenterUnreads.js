import axios from 'axios';
import { API_URL } from '@/constants';

export const resetCenterUnreads = async (token, conversationId) => {
    await axios.post(
        `${API_URL}/api/conversation/reset-center-unread/${conversationId}`,
        null,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
