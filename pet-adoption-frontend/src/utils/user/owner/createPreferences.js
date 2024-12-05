import axios from "../../redux/axiosConfig";
import { API_URL } from "@/constants";
import { updatePreferenceId } from "./updatePreferenceId";

export const createPreferences = async (token, user, preferences) => {
    try {
        // Create a new preference if none exists
        const createResponse = await axios.post(`${API_URL}/api/preferences/create/${user.id}`, preferences, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        try {
            user.preference = createResponse.data.preferenceId;
            const updatedUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailAddress: user.emailAddress,
                UserType: user.UserType,
                password: user.password,
                age: user.age,
                phoneNumber: user.phoneNumber,
                preference: createResponse.data,
                centerZip: user.centerZip,
            };
            console.log("updatedUser: ", updatedUser);
            await updatePreferenceId(token, updatedUser);
            return createResponse.data;
        } catch (error) {
            console.error('Error updating user with new preference ID:', error);
            alert('Failed to update user with new preference ID.');
        }
    } catch (error) {
        console.error('Error creating preference:', error);
        alert('Failed to create preference.');
        return;
    }
};