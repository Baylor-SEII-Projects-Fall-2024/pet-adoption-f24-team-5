import { API_URL } from "@/constants";
import axios from "axios";

export const DeleteEvent = async ({ event, token, resetFields, handleCreateEvent }) => {
    try {
        const url = `${API_URL}/api/events/delete_event/${event.event_id}`;
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response:', response.data);

        // Call reset and toggle only after a successful deletion
        resetFields();
        handleCreateEvent();
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response);
            alert(`Error: ${error.response.status} - ${error.response.statusText}`);
        } else {
            console.error('Unexpected error:', error);
            alert('Error: could not delete event');
        }
    }
};