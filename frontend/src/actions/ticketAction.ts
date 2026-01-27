


import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATH } from "@/data/apiPaths";
import type { ticket } from "@/types";
import { PRIORITY_DATA } from "@/data/data";

export const addTicketAction=async(ticket:ticket)=>{
try {
    const priority=PRIORITY_DATA.filter(x=>x.label===ticket.priority).at(0)?.value||"low";
    const newTicket={...ticket,priority}
 const res=await axiosInstance.post(API_PATH.TICKETS.ADD_TICKET,newTicket);
 if(res.status!==200){
    console.log("Error Adding ticket",res.data.message);
return null; 
}
    return res.data.data;
} catch (error) {
    console.log(error);
    
}

}

export const getTicketByIdAction:(ticketId:string)=>Promise<ticket|null>=async(ticketId)=>{
    try {
        const res=await axiosInstance.get(API_PATH.TICKETS.GET_TICKET_BY_ID(ticketId));
        if(res.status!==200){
         console.log("Error fetching ticket",res.data.message);
    return null; 
    }  
        return res.data.data as ticket;
    } catch (error) {
        console.log(error);
        return null;
    }  
}         

export const getTicketsAction:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS(""),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}

export const getPendingTicketsAction:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("pending");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("pending"),{...params});
    console.log(res);
    
    if(res.status===200||res.status===304){   
        return {data:res.data.data as ticket[],total:res.data.totalCount};
    }
   return {data:[],total:0};
    
}

export const getOpenByMeTicketsAction:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
    console.log("open by me");
    
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open_me"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}

export const getOpenTicketAction:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("open");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}

export const getClosedTicketAction:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("closed");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("complete"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}

export const getSentTicketAction:(status:string,params:any)=>Promise<{data:ticket[],total:number}>=async(status,params)=>{
     console.log("sent");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_MY_TICKETS(status),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getSpecificTicketAction:(t:string,params:any)=>Promise<{data:ticket[],total:number}>=async(path,params)=>{
    
    
    switch(path){
        case "/tickets/pending":{
           
            
            return await getPendingTicketsAction(params);
            break;
        }
        case "/tickets/open_me":{
            return getOpenByMeTicketsAction(params);
            break;
        }
        case "/tickets/open":{
            return getOpenTicketAction(params);
            break;
        }
        case "/tickets/close":{
            return getClosedTicketAction(params);
            break;
        }
         case "/tickets/sent/pending":{
            return getSentTicketAction("pending",params)
            break;
        }
         case "/tickets/sent/open":{
        return getSentTicketAction("open",params)
            break;
        }
         case "/tickets/sent/close":{
        return getSentTicketAction("complete",params)
            break;
        }
        default:{
            return getTicketsAction(params);
        }
    }
}

export const TakeTicketInchargeAction=async(ticketId:string,message:string)=>{
    
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.TAKE_IN_CHARGE(ticketId),{message});
     if(res.status!==200){
    console.log("Error Pris en charge",res.data.message);
  
return null; 
}
toast.success("Ticket a été Pris en charge")
} catch (error) {
    console.log(error);
    // console.log("Error Pris en charge",res.data.message);
    toast.error(`Erreur Pris en charge `)
}
}

export const closeTicketAction=async(ticketId:string,message:string)=>{
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.CLOSE_TICKET(ticketId),{message});
     if(res.status!==200){
    console.log("Error closing ticket",res.data.message);
    toast.error("impossible de clotorer le ticket")
return null; 
}
toast.success("Ticket a été clotoré")
} catch (error) {

    console.log(error);
    toast.error("erreur en clotore de ticket")
}
}

export const relanceeTicketAction=async(ticketId:string,message:string)=>{
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.REOPEN_TICKET(ticketId),{message});
     if(res.status!==200){
    console.log("Error reopen ticket",res.data.message);
    toast.error("impossible re relancer le ticket")
return null; 
}
toast.success("Ticket est relancé")
} catch (error) {
    console.log(error);
    toast.error("erreur relance de ticket")
    
}
}

export const subscribeOrganisationAction=async(ticketId:string,message:string,organisationId:string)=>{
    try {
    const res=await axiosInstance.post(API_PATH.TICKETS.ADD_ORGANISATION(ticketId),{message,organisationId});
     if(res.status!==200){
    console.log("Error reopen ticket",res.data.message);
    toast.error("impossible re relancer le ticket")
return null; 
}
toast.success("Organisation ajoutée")
} catch (error) {
    console.log(error);
    toast.error("erreur ajout d'organisation")
    
}
}








