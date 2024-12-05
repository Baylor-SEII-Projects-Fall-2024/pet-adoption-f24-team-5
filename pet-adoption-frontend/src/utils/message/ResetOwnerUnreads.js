import axios from 'axios';
import { API_URL } from '@/constants';

export const resetOwnerUnreads = async (token, conversationId) => {
    await axios.post(
        `${API_URL}/api/conversation/reset-owner-unread/${conversationId}`,
        null,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
