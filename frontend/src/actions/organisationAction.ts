import axiosInstance from "@/utils/axiosInstance";
import type { Organisation } from "@/types";
import { API_PATH } from "@/data/apiPaths";

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