import {API_URL} from "@/constants";
import axios from "axios";

export const savePet = ({petData, token, resetFields}) => {


    console.log('Pet Data: ', petData);

    const url = `${API_URL}/api/pets/save/pet`;

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
