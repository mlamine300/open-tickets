import { API_PATH } from "@/data/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import type { Comment } from "@/types";

export const AddCommentAction=async(ticketId:string,action:string,message:string)=>{
   
    try {
        
        
        const res=await axiosInstance.post(API_PATH.COMMENT.ADD_COMMENT(ticketId),{message,action});
        if(res.status!==200){
            console.log("error adding comment",res.data);
            return
        }
        else
        toast.success("comment ajouter avec succés !!! ")
    } catch (error) {
        console.log(error);
        
    }
}

export const getTicketCommentsAction:(id:string)=>Promise<Comment[]>=async(ticketId:string)=>{
try {
    const res=await axiosInstance.get(API_PATH.COMMENT.GET_COMMENTS_OF_TICKETS(ticketId))
    console.log(res);
    
    if(res.status===200){
        return res.data.data;
    }
    else return [];
} catch (error) {
    console.error(error);
    
}
}