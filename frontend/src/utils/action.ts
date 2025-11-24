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
    const res=await axiosInstance.get(API_PATH.TICKETS.GET_ALL_TICKETS);
    if(res.status===200)return res.data.data as ticket[];
   return [];
    
}