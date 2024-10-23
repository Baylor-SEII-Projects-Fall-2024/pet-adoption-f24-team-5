import {API_URL} from "@/constants";
import axios from "axios";


export const deletePet = ({petData, token, resetFields}) => {

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

        })
        .catch(error => {
            console.log(error)});
}