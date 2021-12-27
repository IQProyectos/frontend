import axios from 'axios';

const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    }
  };
const blogsURL = 'http://localhost:5000/api/private/blog';


export const getBlogs = async (id) => {
    id = id || '';
    try{
        return await axios.get(`${blogsURL}/${id}`, config);
    }    
    catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const addBlog = async (blogs) => {
    try{
        return await axios.post(`${blogsURL}/`, blogs, config);
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}

export const deleteBlog = async (id) => {
    try{
        return await axios.delete(`${blogsURL}/${id}`, config);
    }catch(error){
        throw Error(error?.response?.data?.error);
    }
}

export const editBlog = async (id, blogs) => {
    try{
        return await axios.patch(`${blogsURL}/${id}`, blogs, config)
    }catch(error){
        return new TypeError("Authentication failed!");
    }
}