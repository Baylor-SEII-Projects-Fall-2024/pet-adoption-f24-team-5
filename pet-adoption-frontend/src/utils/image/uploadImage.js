import axios from 'axios';
import { API_URL } from '@/constants';

export const uploadImage = async (token, formData, setUploadProgress) => {
    const response = await axios.post(
        `${API_URL}/api/images/upload`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percentCompleted);
            },
        }
    );

    return response.data;
};