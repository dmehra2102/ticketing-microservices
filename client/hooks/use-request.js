
import axios from "axios";
import { useState } from "react";

const useRequest = ({onSuccess})=>{
    const [errors,setErrors] = useState([])

    const makeRequest = async ( url, method, body)=>{
        setErrors([]);
        try {
            const response = await axios[method](url, body);
            if(onSuccess) onSuccess(response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ message: 'Something went wrong. Please try again.' }]);
            }
        }
    }

    return { errors, makeRequest}
}

export default useRequest;