import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const bioprocessURL = 'http://localhost:5000/api/private/bioprocess';


export const getBioprocesses = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${bioprocessURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addBioprocess = async (bioprocess) => {
    try {
        return await axios.post(`${bioprocessURL}/`, bioprocess, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteBioprocess = async (id) => {
    try {
        return await axios.delete(`http://localhost:5000/api/private/bioprocess/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editBioprocess = async (id, bioprocess) => {
    try {
        return await axios.patch(`${bioprocessURL}/${id}`, bioprocess, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}