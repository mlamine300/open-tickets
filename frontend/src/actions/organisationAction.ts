import axiosInstance from "@/utils/axiosInstance";
import type { Organisation } from "@/types";
import { API_PATH } from "@/data/apiPaths";
import toast from "react-hot-toast";


export const fetchOrganisationsAction:({page,search}:{page:number,search:string})=>Promise<Organisation[]> =async({page,search})=>{
  try {
    const res=await axiosInstance.post(API_PATH.ORGANISATIONS.GET_ORGANISATIONS,{page,search});
  if(res.status===200){
  return res.data.data;
} 
  return null;
  }
  catch (error) {
    console.log(error)
  }
}

export const getAllorganisationsAction:()=>Promise<Organisation[]> =async()=>{
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
  //console.log("null99998");
  
return null;
}

return localOrganisations;
}

export const getOrganisationIdAction=async(name:string)=>{
  const organisations=await getAllorganisationsAction();
  const foundOne=organisations.filter(x=>x.name===name);
  if(!foundOne||foundOne.length<1)return null;
  return foundOne.at(0)
}

export const getOrganisationByid:(id:string)=>Promise<Organisation> =async(id)=>{
  try {
    const res=await axiosInstance.get(API_PATH.ORGANISATIONS.GET_ORGANISATION_BY_ID(id));
    if(res.status===200)return res.data.data;
    else return null;
  } catch (error) {
    console.log(error)
  }
}

export const addOrganisationAction=async(o:Organisation)=>{
  try {
        const res=await axiosInstance.post(API_PATH.ORGANISATIONS.ADD_ORGANISATION,{...o});
    if(res.status===200){
      toast.success("Organisation Ajouté!!");
    return res.data.data;
    }
    else toast.error("Error en ajoutant l'organisation")
    return null;
  } catch (error) {
    console.log(error)
    toast.error("Error en ajoutant l'organisation");
  }
}

export const updateOrganisationAction=async(id:string,o:any)=>{
  try {
        const res=await axiosInstance.put(API_PATH.ORGANISATIONS.UPDATE_ORGANISATION(id),{...o});
    if(res.status===200){
      toast.success("Organisation Updated!!");
    return res.data.data;
    }
    else toast.error("Error en update l'organisation")
    return null;
  } catch (error) {
    console.log(error)
    toast.error("Error en update l'organisation");
  }
}

export const deleteOrganisationAction=async(id:string)=>{
  try {
    const res=await axiosInstance.delete(API_PATH.ORGANISATIONS.DELETE_ORGANISATION_BY_ID(id));
    if(res.status===200)toast.success(`Organisation a été supprimé`);
    else toast.error(res.data.message);
  } catch (error) {
    toast.error("impossible de supprimer cette organisation elle est liés a des tickets ou a des utilisateurs");
    console.log(error)
    
  }
}
