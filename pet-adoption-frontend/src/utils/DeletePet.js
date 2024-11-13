import { API_URL } from "@/constants";
import axios from "../utils/axiosConfig";


export const deletePet = ({ petData, token, resetFields, handlePostNewPet }) => {

    const url = `${API_URL}/api/pets/delete`

    axios
        .delete(url, {
            data: {
                ...petData
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            console.log(res.data);
            alert("Pet deleted successfully!");
            resetFields();
            handlePostNewPet();

        })
        .catch(error => {
            console.log(error)
        });
}