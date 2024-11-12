import { API_URL } from "@/constants";
import axios from "../utils/axiosConfig";
import { getSubjectFromToken } from "@/utils/tokenUtils";

export const SaveUpdateEvent = async ({ formType, event, token, resetFields, handleCreateNewEvent }) => {
    try {
        let url;
        let response;

        if (formType === "update") {
            url = `${API_URL}/api/events/update_event/${event.event_id}`;
            response = await axios.put(url, event, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Update successful:", response.data);
        } else if (formType === "save") {
            const userEmail = getSubjectFromToken(token);
            url = `${API_URL}/api/events/create_event/${userEmail}`;

            console.log("Form Type:", formType);
            console.log("Event Data:", event);
            console.log("Token:", token);

            response = await axios.post(url, event, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Save successful:", response.data);
        }

        // Only call these on a successful API response
        resetFields();
        handleCreateNewEvent();

    } catch (error) {
        if (error.response) {
            const { status, statusText, data } = error.response;
            console.error(`Error ${status}: ${statusText}`, data);

            // Provide specific feedback based on status
            switch (status) {
                case 403:
                    alert("Forbidden: You do not have permission to perform this action.");
                    break;
                case 400:
                    alert("Bad Request: Please check the provided event data.");
                    break;
                default:
                    alert(`Error: ${status} - ${statusText}`);
                    break;
            }
        } else {
            // Handle unexpected errors or network issues
            console.error("Unexpected error:", error);
            alert("An unexpected error occurred. Please try again.");
        }
    }
};