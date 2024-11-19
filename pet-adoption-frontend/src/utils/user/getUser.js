import axios from '../redux/axiosConfig';
import { API_URL } from '@/constants';

export const getUser = async (token, userEmail) => {
    const response = await axios.get(`${API_URL}/api/users/getUser`, {
        params: { emailAddress: userEmail },
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};