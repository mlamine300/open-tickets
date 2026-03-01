import { useEffect, useState } from "react";
import Input from "../ui/Input"

import type { ticket } from "@/types";
import TicketRow from "./TicketRow";
import { getPendingTicketsAction } from "@/actions/ticketAction";


const SearchMenuForSideBar = () => {
    const [search, setSearch] = useState("");
    const [ticketsList, setTicketsList] = useState<ticket[]>([]);
    useEffect(()=>{
       const getTicket=async()=>{
        const {data}=await getPendingTicketsAction({page:1});
        if(data)setTicketsList(data);
       }
       getTicket();
    },[search])
  return (
    <div className="w-full flex flex-col">
        <Input label="Recherche par ref" onChange={(e)=>setSearch(e.target.value)} value={search}
         placeHolder="Recherche par reference" type="text"labelClassName={"text-xs text-start my-1 italic font-semibold"}
         parentClassName="gap-0 my-2"
         />
      <div className={search&&search.length>3?"flex flex-col w-full max-h-96 overflow-auto":"hidden"}>
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
