
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import Input from "@/components/ui/Input";

import { API_PATH } from "@/data/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import { Power, PowerOff } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";



const Motifpage = () => {
   
    const [pending, setPending] = useState(false);
    console.log(pending)
    const [actionPending, setActionPending] = useState(false);
    const [motifs, setMotifs] = useState<{_id:string;name:string,active:boolean}[]>([]);
    const [motifToadd, setMotifToAdd] = useState("");
    const AddMotif=async()=>{
        try {
            const name=motifToadd;
            setActionPending(true);
            const res=await axiosInstance.post(API_PATH.MOTIFS.ADD_MOTIF,{name});
            
            if(res.status===200){

                toast.success("Motif a été ajouté avec success")
                setMotifToAdd("");
                setTriggerRerender(Math.random())
            } 
        } catch (error) {
            toast.error("Error adding motif")
        }finally{
             setActionPending(false);
        }
    }
    const handleAction=async({_id,active}:{_id:string;name:string,active:boolean})=>{
       try {
         setActionPending(true);
        if(active){
         const result=   await axiosInstance.post(API_PATH.MOTIFS.TURN_OFF(_id))
         if(result.status===200)toast.success("Motif a été désactivé")
        }
    else{
        const result=   await axiosInstance.post(API_PATH.MOTIFS.TURN_ON(_id))
         if(result.status===200)toast.success("Motif a été activé")
    }
setTriggerRerender(Math.random())
setActionPending(false);
       } catch (error) {
        toast.error("Error !!!")
       }
        
    }
   
        const [triggerRerender, setTriggerRerender] = useState<number>(0);
    useEffect(()=>{
       
        
            const fetchMotif=async()=>{
                setPending(true);
                const motifRes=await axiosInstance.get(API_PATH.MOTIFS.GET_ALL_MOTIFS);
                if(motifRes){
                    const fetchedMotifs=motifRes.data.data as {_id:string;name:string,active:boolean}[];
                    setMotifs(fetchedMotifs);
                }   
                setPending(false);
            }
        
        fetchMotif();
       
    },[triggerRerender])
    return (
        <div className="flex w-full h-full">
            <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>
              <div className="flex gap-8 items-center w-full min-w-full lg:min-w-lg">
            <Input label="Ajouter un motif" onChange={(e)=>setMotifToAdd(e.target.value)} value={motifToadd} placeHolder="Service X" type="text"  />
             <Button disabled={!motifToadd||actionPending} text="Ajouter" variant="primary" onClick={()=>AddMotif()}/>
              </div>
               <div className="flex flex-col items-center w-full min-w-full lg:min-w-lg">
                    <h3>List des Motifs</h3>
               <div className="grid grid-cols-2 gap-8">
            {motifs.map(m=>
                <div className="flex justify-between w-full rounded-xl shadow-2xl shadow-black p-5 items-center">
                    <h3 className="text-sm">
                        {m.name}
                    </h3>
                    <button disabled={actionPending} onClick={()=>handleAction(m)}>
                        {m.active?<PowerOff className="text-red-500 hover:scale-125 disabled:text-gray-500" /> : <Power className="text-green-500  hover:scale-125 disabled:text-gray-500"/>}
                    </button>
                </div>

               )}
               </div>
               </div>
            </Card>
            
        </div>
    )
}

export default Motifpage
