import { useUserContext } from "@/context/user/userContext"
import { translateStatus } from "@/data/data";
import type { ticket } from "@/types"
import { Link, useSearchParams } from "react-router-dom"


const TicketRow = ({ticket}:{ticket:ticket}) => {
    const {user}=useUserContext();
    const [searchParams] = useSearchParams();

 
  const newSearchParams = new URLSearchParams(searchParams);
  newSearchParams.set('search', ticket.ref);
 

    const suffPAth=ticket.emitterOrganization?._id===user?.organisation?"/tickets/sent":"/tickets"
    const status=ticket.status==="pending"?"/pending":ticket.status==="open"?"/open":ticket.status==="traited"?"/traited":"/close";
    const color=ticket.status==="pending"?"#f00":ticket.status==="open"?"#F4F754":ticket.status==="traited"?"#0f0":"#08f";

  return (
    <Link className="flex flex-col items-start rounded-lg bg-gray-hot/20 mx-2 my-1 p-2 gap-2 "
     to={{
    pathname: `${suffPAth + status}`,
    search: `?${newSearchParams.toString()}`
  }}
  
   >
      <div className="flex justify-between px-2 w-full ">
        <p className="italic capitalize text-[10px] font-semibold">{ticket.ref}</p>
        <p className="italic capitalize text-[10px] rounded-full px-1 py-px" style={{backgroundColor:color}} >{translateStatus(ticket.status||"")} </p>
      </div>
      <p className=" capitalize text-xs">{ticket.motif} </p>
      <p className=" capitalize text-xs"><span className="font-semibold">Créer Par :</span> {ticket.creator?.name} </p>
       <p className=" capitalize text-xs"><span className="font-semibold">Motif :</span> {ticket.motif} </p>
     
          <p className=" capitalize text-xs"><span className="font-semibold">De :</span> {ticket.emitterOrganization?.name} </p>
     <p className=" capitalize text-xs"><span className="font-semibold">Vers :</span> {ticket.recipientOrganization?.name} </p>


    </Link>
  )
}

export default TicketRow
