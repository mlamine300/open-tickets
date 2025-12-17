import { API_PATH } from "@/data/apiPaths";
import type { User, userFormType } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

export const addUserAction:(u:Omit<userFormType,"rePassword">)=>Promise<User>=async(user)=>{
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

export const getUserByidAction:(id:string)=>Promise<any>=async(id)=>{
    try {
        const res=await axiosInstance.get(API_PATH.USERS.GET_USER_BY_ID(id));
        if(res.status===200)return res.data.data ;
        console.log({message:"getUserByid error",response:res.data})
        return null
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const updateUserAction:(id:string,values:any)=>Promise<User>=async(id,values)=>{
    try {
        const res=await axiosInstance.put(API_PATH.USERS.UPDATE_USER(id),{...values});
        if(res.status===200)return res.data.data;
        
    } catch (error) {
        console.log(error)
    }
}