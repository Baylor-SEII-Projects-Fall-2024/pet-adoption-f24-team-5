import { API_URL } from "@/constants";
import axios from "../redux/axiosConfig";

export const deletePet = async ({ petData, token, resetFields, handlePostNewPet, email }) => {
    const url = `${API_URL}/api/pets/delete?email=${email}`;

    try {
        const response = await axios.delete(url, {
            data: {
                ...petData
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data);
        alert("Pet deleted successfully!");
        if (resetFields) resetFields();
        if (handlePostNewPet) handlePostNewPet();

    } catch (error) {
        console.error('Error deleting pet:', error);
        throw error;
    }
};