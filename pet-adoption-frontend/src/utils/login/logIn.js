import axios from '@/utils/redux/axiosConfig';
import { API_URL } from '@/constants';
import { setToken } from '@/utils/redux/userSlice';

export const handleLogIn = async (emailAddress, password, setErrorMessage, navigate, dispatch) => {

    const loginRequest = {
        emailAddress,
        password
    };

    axios
        .post(`${API_URL}/api/auth/authenticate`, loginRequest)
        .then((res) => {
            if (res.status !== 401) {
                dispatch(setToken(res.data.token));
                setErrorMessage(''); // Clear error message on success
                navigate('/');
            }
        })
        .catch((err) => {
            if (err.response && err.response.status === 401) {
                setErrorMessage(err.response.data); // Set error message from response
            } else {
                console.error('An unexpected error occurred:', err);
                setErrorMessage('Email or password is incorrect please try again');
            }
        });
};