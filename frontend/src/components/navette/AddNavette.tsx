import { useState } from "react";
import Input from "../ui/Input";

import AddAttachement from "../ticket/AddAttachement";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { addNavetteAction, updateNavetteAction } from "@/actions/navetteAction";
import { uploadFile } from "@/utils/UploadAttachement";
import { useNavigate } from "react-router";
import type { Navette } from "@/types";



const AddNavette = ({closeModal,navette}:{closeModal:any,navette:Navette|null}) => {
 const today = format(new Date(), "yyyy-MM-dd'T'HH:mm");

const dDate = navette?.departureTime
  ? format(new Date(navette.departureTime), "yyyy-MM-dd'T'HH:mm")
  : today;

const aDate = navette?.arrivalTime
  ? format(new Date(navette.arrivalTime), "yyyy-MM-dd'T'HH:mm")
  : today;
        const [navetteRef, setNavetteRef] = useState<string>(navette?.navetteRef||"");
       const [departTime, setDepartTime] = useState<string>(dDate);
const [arrivalTime, setArrivalTime] = useState<string>(aDate);
        const [comment, setComment] = useState(navette?.comment||"");
        const navigate=useNavigate();
     
  
    const [attachementFile, setAttachementFile] = useState<File|null>(null);
const reset=()=>{
  setDepartTime("");
  setArrivalTime("");
  setAttachementFile(null);
  setNavetteRef("");
  setComment("");
  close();
}

    const handleSubmit=async()=>{
        
         
             
        if(!departTime||!arrivalTime){
           
            toast.error("Merci de bien choisir la date d'arrivée et de départ")
            return;
        }
        let attachmentUrl; //dd-MM-yyyy HH:mm
            
            if (attachementFile) {
              const attachmentResponse = await uploadFile(attachementFile);
              //console.log(attachmentResponse);
              attachmentUrl = attachmentResponse.fileUrl ?? "";
              console.log(attachmentUrl);
            }
            if(!navette)
        await addNavetteAction({arrivalTime:new Date(arrivalTime),departureTime:new Date(departTime),navetteRef,attachement:attachmentUrl,comment})
        else await updateNavetteAction(navette.id,{arrivalTime:new Date(arrivalTime),departureTime:new Date(departTime),navetteRef,attachement:attachmentUrl,comment})
            reset();
        closeModal();
        navigate("")
    }

  return (
    <div className="grid grid-cols-2 gap-4  mb-auto ">
       <div className="flex flex-col gap-px items-start">
    <label className="text-sm italic font-medium underline" htmlFor="arrival_time">Temps d'arrivée</label>
        <input
           value={arrivalTime}
        onChange={(e)=>setArrivalTime((e.target.value))}
        id="arrival_time"
  aria-label="Date and time"
  lang="fr-FR"
  type="datetime-local"
  className="h-10 w-[89%] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
/>
  </div>
         <div className="flex flex-col gap-px items-start">
    <label className="text-sm italic font-medium underline" htmlFor="depart_time">Temps de départ</label>
        <input
         value={departTime}
        onChange={(e)=>setDepartTime((e.target.value))}
        id="depart_time"
  aria-label="Date and time"
  lang="fr-FR"
  type="datetime-local"
  className="h-10 w-[89%] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50"
/>
  </div>
        <Input label="Navette / Chauffeur" onChange={(e)=>setNavetteRef(e.target.value)}
         placeHolder="Hamza" type="text" value={navetteRef}
         parentClassName="gap-0 items-start my-px" labelClassName="text-sm font-medium italic underline"  />

         <AddAttachement className=" flex flex-col items-start"  labelClassName={"text-sm font-medium italic underline"}  label="Image" image={attachementFile} setImage={(image:File)=>setAttachementFile(image)}/>
        <Input  type="area" label="Commentaire" onChange={(e)=>setComment(e.target.value)} value={comment} placeHolder="..."
         parentClassName="gap-0 items-start my-px col-span-2 min-h-25 " containerClassName="min-w-full" labelClassName="text-sm font-medium italic underline"  />
        <div className="col-span-2 flex items-center justify-center">
        <Button className="px-8 py-1" text={navette?"Modifier":"Ajouter"} variant="primary" onClick={handleSubmit} />
        </div>
    </div>
  )
}

export default AddNavette
