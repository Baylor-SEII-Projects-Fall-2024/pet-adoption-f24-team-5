import axios from '../../redux/axiosConfig';
import { getSubjectFromToken } from '../../redux/tokenUtils';
import { API_URL } from '@/constants';

export const getCenterID = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/api/adoption-center/getCenterID/${getSubjectFromToken(token)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data);
        return response.data; // Return the center_id
    } catch (err) {
        console.error('An error occurred while fetching the center ID:', err);
        throw err; // Re-throw the error to handle it in handleSubmit
    }
};