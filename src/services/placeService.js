import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const placesURL = 'http://localhost:5000/api/private/place';


export const getPlaces = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${placesURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addPlace = async (places) => {
    try{
        return await axios.post(`${placesURL}/`, places, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deletePlace = async (id) => {
    try{
        return await axios.delete(`${placesURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editPlace = async (id, places) => {
    try{
        return await axios.patch(`${placesURL}/${id}`, places, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}