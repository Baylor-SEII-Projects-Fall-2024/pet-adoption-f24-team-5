import axios from 'axios';
import { handleTokenExpiration } from './checkTokenExpiration';
import { store } from '@/utils/redux';

// Add a response interceptor
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const token = store.getState().user.token;
            if (token && handleTokenExpiration()) {
                // Redirect to session expired page instead of login
                window.location.href = '/session-expired';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axios;