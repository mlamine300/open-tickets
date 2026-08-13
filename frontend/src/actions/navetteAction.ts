import { API_PATH } from "@/data/apiPaths"
import type { NavetteForm } from "@/types";
import axiosInstance from "@/utils/axiosInstance"
import toast from "react-hot-toast"

export const addNavetteAction=async({params}:{params:NavetteForm})=>{
try {
    const res=await axiosInstance.post(API_PATH.NAVETTE.ADD_NAVETTE,params);
    if(res.status===201)toast.success("Navette Ajooutée avec succès")
} catch (error:any) {
    console.log(error)
        toast.error('Error fetching motifs')
        if(error.response&&error.response.message)toast.error(error.response.message)
    
}
}