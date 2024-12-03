import axios from '../redux/axiosConfig';
import { getCenterID } from '../user/center/getCenterID';
import { API_URL } from '@/constants';

export const handleRegisterCenterWorker = async (registrationData, token) => {
    registrationData.centerID = await getCenterID(token);
    axios.post(`${API_URL}/api/auth/register/center-worker`, registrationData);
};