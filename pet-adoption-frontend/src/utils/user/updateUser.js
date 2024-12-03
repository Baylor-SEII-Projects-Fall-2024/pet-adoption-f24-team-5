import axios from '../redux/axiosConfig';
import { setDisplayName } from '../redux/userSlice';

export const handleUpdateUser = async (updatedValuesRef, token, dispatch, userEmail) => {
    try {
        const currentUser = await getUser(token, userEmail);
        const updatedUser = {
            id: currentUser.id,
            emailAddress: currentUser.emailAddress,
            password: updatedValuesRef.current.password || password,
            phoneNumber: updatedValuesRef.current.phoneNumber,
            UserType: updatedValuesRef.current.userType,
            ...(updatedValuesRef.current.userType === 'Owner' || updatedValuesRef.current.userType === 'CenterWorker') && {
                age: updatedValuesRef.current.age,
                firstName: updatedValuesRef.current.firstName,
                lastName: updatedValuesRef.current.lastName,
                ...(updatedValuesRef.current.userType === 'Owner' && { centerZip: updatedValuesRef.current.centerZip }),
                ...(updatedValuesRef.current.userType === 'CenterWorker' && { centerId: currentUser.centerId })
            },
            ...(updatedValuesRef.current.userType === 'CenterOwner') && {
                centerName: updatedValuesRef.current.centerName,
                centerAddress: updatedValuesRef.current.centerAddress,
                centerCity: updatedValuesRef.current.centerCity,
                centerState: updatedValuesRef.current.centerState,
                centerZip: updatedValuesRef.current.centerZip,
                centerPetCount: currentUser.centerPetCount
            }
        };

        const url = `${API_URL}/api/users/update/${updatedValuesRef.current.userType}`
        const updatedResponse = await axios.put(url, updatedUser, {
            params: { oldPassword: updatedValuesRef.current.oldPassword },

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (updatedResponse.status !== 200) {
            return 1;
        }
        else {
            if (updatedValuesRef.current.userType !== 'CenterOwner') {
                const newDisplayName = `${updatedValuesRef.current.firstName}`;
                dispatch(setDisplayName(newDisplayName));
            }
            else {
                const newDisplayName = updatedValuesRef.current.centerName;
                dispatch(setDisplayName(newDisplayName));
            }
        }
        return 0;
    } catch (error) {
        console.error('Failed to update user', error);
        return 1;
    }
};
