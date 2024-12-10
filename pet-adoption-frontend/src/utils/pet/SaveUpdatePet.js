import { API_URL } from "@/constants";
import axios from "../redux/axiosConfig";
import { getSubjectFromToken } from "@/utils/redux/tokenUtils";

export const saveUpdatePet = ({ formType, petData, token, resetFields, handlePostNewPet }) => {
    const email = getSubjectFromToken(token);
    let url = `${API_URL}/api/pets/`;

    switch (formType) {
        case "update":
            url += `update?email=${email}`;
            break;
        case "save":
            url += `save?email=${email}`;
            break;
        case "adopt":
            url += `update?email=${email}`;
            break;
        default:
            url += `save?email=${email}`;
    }

    console.log('Pet Data: ', petData);

    return axios
        .post(url, petData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            const action = formType === "adopt" ? "adopted" : "saved";
            alert(`Pet ${action}!`);
            if (formType !== "update" && resetFields) {
                resetFields();
                if (handlePostNewPet) handlePostNewPet();
            }
            return res.data;
        })
        .catch((err) => {
            console.error('An error occurred:', err);
            alert(`An error occurred ${formType === "adopt" ? "adopting" : "saving"} pet. Please try again later.`);
            throw err;
        });
};
