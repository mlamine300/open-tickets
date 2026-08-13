import { useState } from "react";
import Input from "../ui/Input";
import { TimePicker } from "./TimePicker";
import AddAttachement from "../ticket/AddAttachement";
import Button from "../ui/Button";
import toast from "react-hot-toast";
import { formatDate, parse } from "date-fns";


const AddNavette = () => {
        const [navetteRef, setNavetteRef] = useState<string>("");
        const hour=new Date().getHours()+"";
        const minute=new Date().getMinutes()+"";
    const [dateStart, setDateStart] = useState<string>(`${hour}:${minute}`);
    const [dateEnd, setDateEnd] = useState<string>(`${hour}:${minute}`);
    const [attachement, setAttachement] = useState<string>("");


    const handleSubmit=()=>{
         const today=formatDate(new Date(),"dd-MM-yyyy");
         console.log(`${today} ${dateStart}:00`)
         
            const mDateStart= parse(`${today} ${dateStart}`,"dd-MM-yyyy HH:mm",new Date())                   // new Date(`${today} ${dateStart}:00`)
            const mDateEnd=parse(`${today} ${dateEnd}`,"dd-MM-yyyy HH:mm",new Date())   
        if(!mDateStart||!mDateEnd){
           
            toast.error("Merci de bien choisir la date d'arrivée et de départ")
        }
        console.log({mDateStart,mDateEnd,navetteRef,attachement})
    }

  return (
    <div className="grid grid-cols-2 gap-4  mb-auto ">
      <TimePicker value={dateStart} label="Arrivé aujourd'hui a " onChange={(s)=> setDateStart(s)}/>
    <TimePicker value={dateEnd} label="Départure aujourd'hui a " onChange={(s)=> setDateEnd(s)}/>
        <Input label="Navette / Chauffeur" onChange={(e)=>setNavetteRef(e.target.value)}
         placeHolder="Hamza" type="text" value={navetteRef}
         parentClassName="gap-0 items-start my-px" labelClassName="text-sm font-medium italic underline"  />

         <AddAttachement className=" flex flex-col items-start"  labelClassName={"text-sm font-medium italic underline"}  label="Image" image={attachement} setImage={(image:string)=>setAttachement(image)}/>
        
        <div className="col-span-2 flex items-center justify-center">
        <Button className="px-8 py-1" text="Ajouter" variant="primary" onClick={handleSubmit} />
        </div>
    </div>
  )
}

export default AddNavette
