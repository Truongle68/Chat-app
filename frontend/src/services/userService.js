import axios, { config } from "./api";

const authUser = async(email, password)=>{
    return await axios.post('/user/login', {
        email,
        password
    }, config)
} 

const searchedUser = async(searchText,config)=>{
    return await axios.get(`/user?search=${searchText}`, config)
}


export {authUser, searchedUser}