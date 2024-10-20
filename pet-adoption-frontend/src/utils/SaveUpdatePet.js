import {API_URL} from "@/constants";
import axios from "axios";

export const saveUpdatePet = ({formType, petData, token, resetFields}) => {

    let url = `${API_URL}/api/pets/`

    if(formType === "update") {
       url  += `update`;
    } else if (formType === "save") {
        url += `save`;
    }

    console.log('Pet Data: ', petData);

    axios
        .post(url, petData, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in the header
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            alert('Pet Saved!');
            resetFields();
        })
        .catch((err) => {
            console.error('An error occurred during registration:', err);
            alert('An error occurred saving pet. Please try again later.');
        });

}
