import store from '@/utils/redux';
import { clearToken } from '@/utils/userSlice';
import { getPayloadFromToken } from '@/utils/tokenUtils';

export const checkTokenExpiration = (token) => {
    if (!token) return true;

    try {
        const payload = getPayloadFromToken(token);
        if (!payload) return false;
        if (!payload.exp) return false;

        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return false;
    }
};

export const handleTokenExpiration = () => {
    const token = store.getState().user.token;

    if (!token) return false;

    const isExpired = checkTokenExpiration(token);
    if (isExpired) {
        store.dispatch(clearToken());
        return true;
    }
    return false;
};