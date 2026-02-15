import { API_PATH } from "@/data/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";

export const addInfo=async({message,isLatin}:{message:string,isLatin:boolean})=>{
   
    try {
        
        
        const res=await axiosInstance.post(API_PATH.INFO,{message,isLatin});
        if(res.status!==200){
            console.log("error adding info",res.data);
            return
        }
        else
        toast.success("Info modifié avec succés !!! ")
    } catch (error) {
        console.log(error);
        toast.error("Error Adding info")
        
    }
}

export const removeInfo=async()=>{
try {
        
        
        const res=await axiosInstance.delete(API_PATH.INFO);
        if(res.status!==200){
            console.log("error removing info",res.data);
            return
        }
        else
        toast.success("Info Désactivé avec succés !!! ")
    } catch (error) {
        console.log(error);
        toast.error("Error removing info")
        
    }
}

export const getLastInfo=async()=>{
    try {
        const res=await axiosInstance.get(API_PATH.INFO);
        if(res.status===200){
            return res.data.data;
        }
    } catch (error) {
        console.log(error)
    }
}