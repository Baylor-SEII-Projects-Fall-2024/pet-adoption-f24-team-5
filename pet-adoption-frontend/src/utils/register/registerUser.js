import axios from '@/utils/redux/axiosConfig';
import { handleLogIn } from '@/utils/login/logIn';
import { API_URL } from '@/constants';

export const handleRegisterUser = async (registrationData, navigate, dispatch, setErrorMessage) => {
    const userType = registrationData.userType === 'CenterOwner' ? 'adoption-center' : 'owner';
    axios
        .post(`${API_URL}/api/auth/register/${userType}`, registrationData)
        .then(() => {
            handleLogIn(registrationData.emailAddress, registrationData.password, setErrorMessage, navigate, dispatch);
        })
        .catch((err) => {
            if (err.response && err.response.data) {
                setErrorMessage(err.response.data);
            } else {
                console.error('An unexpected error occurred during registration:', err);
                setErrorMessage('Email already exists');
            }
        });

};