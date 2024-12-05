import { API_URL } from "@/constants";
import axios from "../redux/axiosConfig";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";

export const saveUpdatePet = ({ formType, petData, token, resetFields, handlePostNewPet }) => {

    let url = `${API_URL}/api/pets/`

    if (formType === "update") {
        url += `update`;
    } else if (formType === "save") {
        url += `save`;
    }

    url += `?email=${getSubjectFromToken(token)}`

    console.log('Pet Data: ', petData);

    axios
        .post(url, petData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            alert('Pet Saved!');
            if (formType !== "update") {
                resetFields();
                handlePostNewPet();
            }
        })
        .catch((err) => {
            console.error('An error occurred during registration:', err);
            alert('An error occurred saving pet. Please try again later.');
        });

}
