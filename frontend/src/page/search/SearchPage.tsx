import {  SearchTicketWithRefAction } from "@/actions/ticketAction";

import TicketCard from "@/components/search/TicketCard";
import TicketViewOnModal from "@/components/ticket/TicketViewOnModal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"
import Modal from "@/components/ui/Modal";
import type { ticket } from "@/types";
import { useState, type MouseEvent } from "react";
import toast from "react-hot-toast";


const SearchPage = () => {
    const [reference, setReference] = useState("");
    const [pending, setPending] = useState(false);
    const [foundedTickets, setFoundedTickets] = useState<ticket[]>([]);
    const [showModal, setShowModal] = useState(false);
    const handleSearch=async(e:MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault();
        if(!reference){
            toast.error("Pas de référence");
            return;
        }
        setPending(true);
        const tickets=await SearchTicketWithRefAction(reference);
        setFoundedTickets(tickets);
        setPending(false)
    }
    const [selectTicket, setSelectTicket] = useState<ticket|null>(null);
  return (
    <main className="flex flex-col w-full h-screen ">
        <div className="w-full bg-background-base p-4 rounded-2xl">
            
      <section className="w-full lg:w-7/12 flex mx-auto items-center gap-8">
        <Input labelClassName="italic text-sm" containerClassName="w-full" parentClassName="w-7/12 gap-px items-start" placeHolder="ECXXXX260101XXXXXX" label="Chercher un ticket par référence" type="text" value={reference} onChange={(e)=>setReference(e.target.value.trim())} />
      <Button onClick={handleSearch} text="Rechercher" variant="primary" className="px-4 py-2 mt-4" disabled={!reference||pending }/>
      </section>
        </div>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {foundedTickets.map(ft=><TicketCard ticket={ft} onClick={()=>{
            setSelectTicket(ft);
            setShowModal(true);
        }} />)}
        </section>
        
        {selectTicket&&
        
        <Modal className=" md:min-w-8/12 min-h-10/12 overflow-y-auto" showModal={showModal} close={()=>{
            setShowModal(false);
            setSelectTicket(null)}} title={selectTicket.ref||""}>
<TicketViewOnModal isModal={false} ticket={selectTicket}/>
        </Modal>
        
        }
    </main>
  )
}

export default SearchPage
