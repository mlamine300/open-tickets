import { API_PATH } from "@/data/apiPaths"
import type { Navette, NavetteForm } from "@/types";
import axiosInstance from "@/utils/axiosInstance"
import toast from "react-hot-toast"

export const addNavetteAction=async(params:NavetteForm)=>{
try {
    const res=await axiosInstance.post(API_PATH.NAVETTE.ADD_NAVETTE,params);
    if(res.status===201)toast.success("Navette Ajooutée avec succès")
} catch (error:any) {
    console.log(error)
        toast.error('Error adding navette')
        if(error.response&&error.response.message)toast.error(error.response.message)
    
}
}

export const searchNavetteAction:(params:any)=>Promise<Navette[]> =async(params)=>{
    try {
        const res=await axiosInstance.post(API_PATH.NAVETTE.SEARCH_NAVETTE,params);
        if(res.status===200)return res.data.data as Navette[];

        return [];
    } catch (error:any) {
         console.log(error)
        toast.error('Error fetching motifs')
        if(error.response&&error.response.message)toast.error(error.response.message)
            return [];
    }
}