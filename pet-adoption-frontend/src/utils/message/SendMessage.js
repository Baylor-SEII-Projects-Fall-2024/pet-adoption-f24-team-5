import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const sendMessage = async (token, currentConversationId, userData, receiverId, messageInput) => {
    const newMessageData = {
        conversationId: currentConversationId,
        senderId: userData.id,
        receiverId: receiverId,
        message: messageInput,
        isRead: false,
    };

    const response = await axios.post(`${API_URL}/api/message/sendMessage`, newMessageData, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};
