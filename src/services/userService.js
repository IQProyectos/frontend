import axios from 'axios';

const config = {
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
};
const userURL = 'http://localhost:5000/api/private/users';


export const getUsers = async (id) => {
    try {
        id = id || '';
        return await axios.get(`${userURL}/${id}`, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const getAllUsers = async (id) => {
    try {
        id = id || '';
        return await axios.get('http://localhost:5000/api/private/allUsers', config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const addUser = async (user) => {
    try {
        return await axios.post(`${userURL}/`, user, config);
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const deleteUser = async (id) => {
    try {
        return await axios.delete(`${userURL}/${id}`, config);
    } catch (error) {
        throw Error(error?.response?.data?.error);
    }
}

export const editUser = async (id, user) => {
    try {
        return await axios.patch(`${userURL}/${id}`, user, config)
    } catch (error) {
        return new TypeError("Authentication failed!");
    }
}

export const getPermissions = async (uid, bid) => {
    try{
        return await axios.get(`http://localhost:5000/api/private/permissions/${uid}/${bid}`,config);
    }catch(error) {
        return new TypeError("Authentication failed!");
    }
}

export const editRoles = async (uid, newRoles) => {
    try{
        return await axios.post(`http://localhost:5000/api/private/userRole/${uid}`, {"roles": newRoles}, config);
    }catch(error) {
        return new TypeError("Authentication failed!");
    }
}