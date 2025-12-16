import { API_PATH } from "@/data/apiPaths";
import type { User } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const addUserAction:(u:User)=>Promise<User>=async(user:User)=>{
    try {
 const res=await axiosInstance.post(API_PATH.USERS.CREATE_USER,user);
 if(res.status!==200){
    console.log("Error Adding User",res.data.message);
return null; 
}
    return res.data.data;
} catch (error) {
    console.log(error);
    
}
}

export const getUsersAction:(p:any)=>Promise<User[]>=async(params:any)=>{
    try {
        const res=await axiosInstance.post(API_PATH.USERS.GET_ALL_USERS,{...params});
        if(res.status===200)return res.data.data;
        
    } catch (error) {
       console.log(error);
        
    }
    return [];
}