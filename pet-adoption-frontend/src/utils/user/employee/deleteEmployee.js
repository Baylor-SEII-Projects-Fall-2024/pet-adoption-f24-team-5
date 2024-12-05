import axios from "@/utils/redux/axiosConfig";
import { API_URL } from "@/constants";

export const deleteEmployee = async (token, employeeId) => {
    try {
        await axios.delete(
            `${API_URL}/api/adoption-center/deleteEmployee/${employeeId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (err) {
        console.error('Failed to delete employee:', err);
    }
};
