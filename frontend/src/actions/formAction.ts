import { API_PATH } from "@/data/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import type { FormType } from "../../../types";

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
  }
  
  
return null;
}

return localForms;


} catch (error) {
    throw error;
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

export const getFormByIdAction=async(id:string)=>{
    try {
        const res=await axiosInstance.get(API_PATH.FORMS.GET_FORM_BY_ID(id));
        if(res.status===200)return res.data.data;
        return null;
    } catch (error) {
        
    }
}