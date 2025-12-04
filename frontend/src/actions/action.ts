import z from "zod";
import type { Organisation, ticket,Comment, FormType } from "../../../types";

import toast from "react-hot-toast";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATH } from "@/utils/apiPaths";

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

export const getTickets:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS(""),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getPendingTickets:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("pending");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("pending"),{...params});
    console.log(res);
    
    if(res.status===200||res.status===304){   
        return {data:res.data.data as ticket[],total:res.data.totalCount};
    }
   return {data:[],total:0};
    
}
export const getOpenByMeTickets:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
    console.log("open by me");
    
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open_me"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getOpenTicket:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("open");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("open"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getClosedTicket:(params:any)=>Promise<{data:ticket[],total:number}>=async(params)=>{
     console.log("closed");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_SPECIFIC_TICKETS("complete"),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getSentTicket:(status:string,params:any)=>Promise<{data:ticket[],total:number}>=async(status,params)=>{
     console.log("sent");
    const res=await axiosInstance.post(API_PATH.TICKETS.GET_MY_TICKETS(status),{...params});
    if(res.status===200) return {data:res.data.data as ticket[],total:res.data.totalCount};
   return {data:[],total:0};
    
}
export const getSpecificTicket:(t:string,params:any)=>Promise<{data:ticket[],total:number}>=async(path,params)=>{
    
    
    switch(path){
        case "/tickets/pending":{
           
            
            return await getPendingTickets(params);
            break;
        }
        case "/tickets/open_me":{
            return getOpenByMeTickets(params);
            break;
        }
        case "/tickets/open":{
            return getOpenTicket(params);
            break;
        }
        case "/tickets/close":{
            return getClosedTicket(params);
            break;
        }
         case "/tickets/sent/pending":{
            return getSentTicket("pending",params)
            break;
        }
         case "/tickets/sent/open":{
        return getSentTicket("open",params)
            break;
        }
         case "/tickets/sent/close":{
        return getSentTicket("complete",params)
            break;
        }
        default:{
            return getTickets(params);
        }
    }
}

export const getAllorganisations:()=>Promise<Organisation[]> =async()=>{
const localOrganisationsString=localStorage.getItem("organisations")||"{}";

const data=JSON.parse(localOrganisationsString)
const {date,organisations:localOrganisations}=data;
const today=new Date().getTime();
const differenceInHours =(Number(new Date(date).getTime())- Number(today))/1000/60/60 ;






if(!localOrganisations||!Array.isArray(localOrganisations)||localOrganisations.length<1||differenceInHours>8){
  const res=await axiosInstance.get(API_PATH.ORGANISATIONS.GET_ALL_ORGANISATIONS);
  console.log("refreshing organisations");
  
  console.log(res);
  if(res.status===200){
  const organisations=res.data.data;
  localStorage.setItem("organisations",JSON.stringify({organisations,date:new Date()}))
  return organisations;
  }
  console.log("null99998");
  
return null;
}

return localOrganisations;
}

export const getOrganisationId=async(name:string)=>{
  const organisations=await getAllorganisations();
  const foundOne=organisations.filter(x=>x.name===name);
  if(!foundOne||foundOne.length<1)return null;
  return foundOne.at(0)
}

export const TakeTicketIncharge=async(ticketId:string,message:string)=>{
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.TAKE_IN_CHARGE(ticketId),{message});
     if(res.status!==200){
    console.log("Error Pris en charge",res.data.message);
return null; 
}
toast.success("Ticket a été Pris en charge")
} catch (error) {
    console.log(error);
    
}
}
export const AddCommentAction=async(ticketId:string,action:string,message:string)=>{
   
    try {
        
        
        const res=await axiosInstance.post(API_PATH.COMMENT.ADD_COMMENT(ticketId),{message,action});
        if(res.status!==200){
            console.log("error adding comment",res.data);
            return
        }
        else
        toast.success("comment ajouter avec succés!!!")
    } catch (error) {
        console.log(error);
        
    }
}

export const getFormsAction=async()=>{
      try {
        const localFormString=localStorage.getItem("forms")||"{}";

const data=JSON.parse(localFormString)
const {date,forms:localForms}=data;
const today=new Date().getTime();
const differenceInHours =(Number(new Date(date).getTime())- Number(today))/1000/60/60 ;

if(!localForms||!Array.isArray(localForms)||localForms.length<1||differenceInHours>8){
 const res=await axiosInstance.get(API_PATH.FORMS.GET_FORMS);
  console.log("refreshing forms");
  console.log(res);
  if(res.status===200){
  const forms=res.data.data;
  localStorage.setItem("forms",JSON.stringify({forms,date:new Date()}))
  return forms;
  }z
  
  
return null;
}

return localForms;


} catch (error) {
    throw error;
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
export const closeTicketAction=async(ticketId:string,message:string)=>{
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.CLOSE_TICKET(ticketId),{message});
     if(res.status!==200){
    console.log("Error closing ticket",res.data.message);
return null; 
}
toast.success("Ticket a été clotoré")
} catch (error) {
    console.log(error);
    
}
}

export const relanceeTicketAction=async(ticketId:string,message:string)=>{
try {
    const res=await axiosInstance.post(API_PATH.TICKETS.REOPEN_TICKET(ticketId),{message});
     if(res.status!==200){
    console.log("Error reopen ticket",res.data.message);
return null; 
}
toast.success("Ticket est relancé")
} catch (error) {
    console.log(error);
    
}
}

export const addFormAction=async(form:FormType)=>{
    try {
        const res=await axiosInstance.post(API_PATH.FORMS.ADD_FORM,form);
        if(res.status===200)toast.success(`Formulaire (${form.name}) a été ajouter avec succés`);
        return true;
    } catch (error) {
     console.log(error);
     return false;
        
    }
}