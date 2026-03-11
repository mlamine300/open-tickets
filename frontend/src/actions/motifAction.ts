import { API_PATH } from "@/data/apiPaths"
import axiosInstance from "@/utils/axiosInstance"
import toast from "react-hot-toast"

export const getActiveMotifsAction=async()=>{
    try {
        const res=await axiosInstance.get(API_PATH.MOTIFS.GET_ACTIVE_MOTIFS);
        if(res.status===200)return res.data.data;
        else return [];
    } catch (error) {
        toast.error('Error fetching motifs')
    }
}

export const getAllMotifAction=async()=>{
     try {
        const res=await axiosInstance.get(API_PATH.MOTIFS.GET_ALL_MOTIFS);
        if(res.status===200)return res.data.data;
        else return [];
    } catch (error) {
        toast.error('Error fetching motifs')
    }
}

export const turnOffMotifAction=async(_id:string)=>{
     const result=   await axiosInstance.post(API_PATH.MOTIFS.TURN_OFF(_id))
         if(result.status===200)toast.success("Motif a été désactivé")
}
export const turnOnMotifAction=async(_id:string)=>{
     const result=   await axiosInstance.post(API_PATH.MOTIFS.TURN_ON(_id))
         if(result.status===200)toast.success("Motif a été Activé")
}

export const addMotif=async(name:string)=>{
    try {
         const res=await axiosInstance.post(API_PATH.MOTIFS.ADD_MOTIF,{name});
            
            if(res.status===200){
                toast.success("Motif a été ajouté avec success")   
            } 
            else toast.error("Impossible d'ajouter le motif")
    } catch (error) {
        toast.error("Impossible d'ajouter le motif")
    }
}

export const getAllMotifsActiveAndNotActiveAction=async()=>{
    try {
       const res=await axiosInstance.get(API_PATH.MOTIFS.GET_ALL_MOTIFS); 
       return res;
    } catch (error) {
        return null;
    }
}