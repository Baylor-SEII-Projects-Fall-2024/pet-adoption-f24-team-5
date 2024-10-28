import {API_URL} from "@/constants";
import axios from "axios";
import {getSubjectFromToken} from "@/utils/tokenUtils";

export const SaveUpdateEvent = ({formType, event, token, resetFields, handleCreateEvent}) => {
    let url;
    if (formType === "update") {
        try {
            url = `${API_URL}/api/events/update_event/${event.event_id}`;
            axios.put(url, event, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res) {
                    console.log(res.data)
                }
            });
        } catch(error) {
            console.error('Error: could not update event:', error);
            alert('Error: could not update event');
        }
    } else if (formType === "save") {
        try {
            url = `${API_URL}/api/events/create_event/${getSubjectFromToken(token)}`;
            axios.put(url, event, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                if(res) {
                    console.log(res.data);
                }
            });
        } catch (error) {
            console.error('Error: could not register event:', error);
            alert('Error: could not register event');
        }
    }
    resetFields();
    handleCreateEvent();
}
