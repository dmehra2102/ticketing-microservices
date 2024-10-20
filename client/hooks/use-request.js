
import axios from "axios";
import { useState } from "react";

const useRequest = ()=>{
    const [errors,setErrors] = useState([])

    const makeRequest = async ( url, method, body)=>{
        try {
            const response = await axios[method](url, body);
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