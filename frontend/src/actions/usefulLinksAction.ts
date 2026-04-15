import { API_PATH } from "@/data/apiPaths"
import type {  UsefulLinkType } from "@/types"
import axiosInstance from "@/utils/axiosInstance"
import toast from "react-hot-toast"

export const addUsefulLinkAction=async(data:UsefulLinkType):Promise<Boolean>=>{
try {
    const res=await axiosInstance.post(API_PATH.USEFUL_LINKS.ADD_USEFUL_LINK,data);
    if(res.status===201){
        toast.success("Lien Ajouté avec succes!")
    return true;
    }
     else if(res.status===204) toast.error("lien avec le meme nom ou lien exist déja");
     else toast.error("erreur en ajoutant le lien");  
     return false; 
} catch (error) {
    toast.error("Impossible d'ajouter le lien")
    console.log(error)
   return false;
}
}

export const getActiveLinksAction=async():Promise<UsefulLinkType[]>=>{
    try {
        const res=await axiosInstance.get(API_PATH.USEFUL_LINKS.GET_ACTIVE_USEFUL_LINKS);
        if(res.status===200)return res.data.data as UsefulLinkType[];
       else return  [];
    } catch (error) {
        console.log(error)
        return [];
    }
}

export const updateUsefulLinkAction=async(id:string,data:any):Promise<Boolean>=>{
try {
    const res=await axiosInstance.post(API_PATH.USEFUL_LINKS.UPDATE_USEFUL_LINK(id),data);
    if(res.status===200){
        toast.success("Lien modifié avec succes!")
    return true;
    }
     else if(res.status===204) toast.error("lien avec le meme nom ou lien exist déja");
     else toast.error("erreur en modifiant le lien");  
     return false; 
} catch (error) {
    toast.error("Impossible de modifier le lien")
    console.log(error)
   return false;
}
}

export const deleteUsefulLinkAction=async(id:string):Promise<Boolean>=>{
try {
    const res=await axiosInstance.post(API_PATH.USEFUL_LINKS.DELETE_USEFUL_LINK(id))
    if(res.status===200){
        toast.success("Lien supprimé avec succes!")
    return true;
    }
     
     return false; 
} catch (error) {
    toast.error("Impossible de supprimer le lien")
    console.log(error)
   return false;
}
}

export const fetchAllUsefulLinkssAction=async():Promise<UsefulLinkType[]>=>{
try {
        const res=await axiosInstance.get(API_PATH.USEFUL_LINKS.GET_ALL_USEFUL_LINKS);
        if(res.status===200)return res.data.data as UsefulLinkType[];
       else return  [];
    } catch (error) {
        console.log(error)
        return [];
    }
}