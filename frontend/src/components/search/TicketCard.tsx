import { translateStatus } from "@/data/data";
import type { ticket } from "@/types"
import { format } from "date-fns"
import { ArrowRightLeft } from "lucide-react"
import type { MouseEventHandler } from "react";


const TicketCard = ({ticket, onClick}:{ticket:ticket,onClick?:MouseEventHandler<HTMLDivElement>}) => {

    const color=ticket.status==="pending"?"#f00":ticket.status==="open"?"#F4F754":ticket.status==="traited"?"#0f0":"#08f";

  return (
    <div onClick={onClick}  className="relative flex flex-col gap-2 w-full h-full max-x-96 rounded-4xl bg-background-base shadow-2xl p-4 m-2 cursor-pointer">
      
        <div className="flex  justify-between">
            <p className="text-xs italic">Créé Le : <strong className="text-primary">{ticket.createdAt?format(ticket.createdAt,"dd/mm/yy HH:MM"):"888"} </strong></p>
             <p className="text-xs italic">Derniere Action : <strong className="text-primary">{ticket.updatedAt?format(ticket.updatedAt,"dd/mm/yy HH:MM"):"888"} </strong></p>
           
        </div>
        <p className="text-lg italic" >
            Ref : <strong className="text-primary">{ticket.ref}</strong>
        </p>
        <div className="flex items-center justify-between">
            <div  className=" flex flex-col items-start">
               <p className="text-xs italic font-semibold">Organisation Emmitrice : </p>
               <p className="text-primary text-xs italic font-bold">{ticket.emitterOrganization?.name} </p>
            </div>
             <ArrowRightLeft className="text-primary"/>
              <div  className=" flex flex-col items-start">
               <p className="text-xs italic font-semibold">Organisation Déstinatrice : </p>
               <p className="text-primary text-xs italic font-bold">{ticket.recipientOrganization?.name} </p>
            </div>
           
        </div>
         <p className="text-sm italic font-semibold" >
            Motif : <strong className="text-primary">{ticket.motif}</strong>
        </p>

        <div className="flex items-center justify-center ">
            <p style={{backgroundColor:color}}  className="px-8 py-2 bg-primary rounded-lg absolute -bottom-4 font-semibold">{translateStatus(ticket.status||"")} </p>
        </div>
      </div>
   
  )
}

export default TicketCard
