import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";

export const updatePreferenceId = async (token, updatedUser) => {
    try {
        const updateUserResponse = await axios.put(`${API_URL}/api/users/update/Owner/preferenceId`, updatedUser, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (updateUserResponse.status === 200) {
            alert('User updated with new preference ID successfully!');
        }
    } catch (error) {
        console.error('Error updating user with new preference ID:', error);
        alert('Failed to update user with new preference ID.');
    }
};