import {API_URL} from "@/constants";
import axios from "axios";

export const DeleteEvent = ({event, token, resetFields, handleCreateEvent}) => {
    try {
        const url = `${API_URL}/api/events/delete_event/${event.event_id}`;
        axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'
            }
        }).then((res) => {
            if(res) {
                console.log(res.data);
            }
            alert('Event deleted.');
            resetFields();
            handleCreateEvent();
        });
    } catch (error) {
        console.error('Error: could not delete event:', error);
        alert('Error: could not delete event');
    }
};