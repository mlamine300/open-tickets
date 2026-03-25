import { useEffect, useState } from "react";
import Input from "../ui/Input"

import type { ticket } from "@/types";
import TicketRow from "./TicketRow";
import {  searchTicketsAction } from "@/actions/ticketAction";
import { FaXmark } from "react-icons/fa6";
import { cn } from "@/lib/utils";


const SearchMenuForSideBar = () => {
    const [search, setSearch] = useState("");
    const [ticketsList, setTicketsList] = useState<ticket[]>([]);
    
    useEffect(()=>{
       const getTicket=async()=>{
        const ticketsRes=await searchTicketsAction(search);
        
        if(ticketsRes){
          setTicketsList(ticketsRes);
         
        }
          
       }
       getTicket();
    },[search])
  return (
    <div className="w-full flex flex-col">
        <div className="flex w-full items-center relative">
          <Input label="Recherche par ref" onChange={(e)=>setSearch(e.target.value)} value={search}
         placeHolder="Recherche par reference" type="text"labelClassName={"text-xs text-start my-1 italic font-semibold"}
         parentClassName="gap-0 my-2 w-full"
         />
         <FaXmark className={cn(!search&&"hidden","hover:scale-110 text-red-500 h-5 w-5 cursor-pointer mt-5 absolute right-3")} onClick={()=>setSearch("")} />
        </div>
      <div className={search&&search.length>2?"flex flex-col w-full max-h-96 overflow-auto":"hidden"}>
        {ticketsList&&ticketsList.length>0?
     
     <div className="flex flex-col gap-2 justify-start">
        {ticketsList.map(t=><TicketRow ticket={t} />)}
    </div>
    :
    <p>Pas de tickets pour cette référence</p>
    }
      </div>
    </div>
  )
}

export default SearchMenuForSideBar
