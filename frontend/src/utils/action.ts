import z from "zod";
import type { ticket } from "../../../types";
import { API_PATH } from "./apiPaths"
import axiosInstance from "./axiosInstance"

export const addTicket=async(ticket:ticket)=>{
try {
 const res=await axiosInstance.post(API_PATH.TICKETS.ADD_TICKET,ticket);
 if(res.status!==200){
    console.log("Error Adding ticket",res.data.message);
return null; 
}
    return res.data.data;
} catch (error) {
    console.log(error);
    
}

}

export const getTickets:()=>Promise<ticket[]>=async()=>{
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_SPECIFIC_TICKETS(""));
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}
export const getPendingTickets:()=>Promise<ticket[]>=async()=>{
     console.log("pending");
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("pending"));
    if(res.status===200||res.status===304){   
        return res.data.data as ticket[];
    }
   return [];
    
}
export const getOpenByMeTickets:()=>Promise<ticket[]>=async()=>{
    console.log("open by me");
    
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open_me"));
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}
export const getOpenTicket:()=>Promise<ticket[]>=async()=>{
     console.log("open");
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open"));
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}
export const getClosedTicket:()=>Promise<ticket[]>=async()=>{
     console.log("closed");
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("closed"));
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}
export const getSentTicket:(status:string)=>Promise<ticket[]>=async(status)=>{
     console.log("sent");
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_MY_TICKETS);
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}
export const getSpecificTicket:(t:string)=>Promise<ticket[]>=async(path)=>{
    
    
    switch(path){
        case "/tickets/pending":{
           
            
            return await getPendingTickets();
            break;
        }
        case "/tickets/open_me":{
            return getOpenByMeTickets();
            break;
        }
        case "/tickets/open":{
            return getOpenTicket();
            break;
        }
        case "/tickets/closed":{
            return getClosedTicket();
            break;
        }
         case "/tickets/sent/pending":{
            return getSentTicket("pending")
            break;
        }
         case "/tickets/sent/open":{
        return getSentTicket("open")
            break;
        }
         case "/tickets/sent/closed":{
        return getSentTicket("closed")
            break;
        }
        default:{
            return getTickets();
        }
    }
}