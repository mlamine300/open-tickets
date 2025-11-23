

import { API_PATH } from "./apiPaths";
import axiosInstance from "./axiosInstance";

// };
export const getColorFromName = (name: string): string => {
  let hash = 0;

  // Create a simple hash from the string
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Map the hash value to a hue (0–360)
  const hue = Math.abs(hash) % 360;

  // Fixed saturation and lightness for good readability
  return `hsl(${hue}, 65%, 55%)`;
};

export const getAllorganisations=async()=>{
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


