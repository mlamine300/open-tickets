
import { getTicketByIdAction } from '@/actions/ticketAction';
import Spinner from '@/components/main/Spinner';
import TicketViewOnModal from '@/components/ticket/TicketViewOnModal';
import type { ticket } from '@/types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const TicketOverViewPage = () => {
    const params=useParams();
    const id=params.id;
    const [ticket, setTicket] = useState<ticket|null>(null);
  useEffect(()=>{
    const getTicket=async()=>{
     const res=await getTicketByIdAction(id!);
      if(res&&res._id){
        setTicket(res);
      }
      //fetch ticket by id
    }
    getTicket();
  },[id])
  return (
    
      <div className='flex w-full h-full layout justify-center items-center min-h-[90vh]'>
        {ticket ?<TicketViewOnModal ticket={ticket} />:<Spinner size='xl' />}
      </div>
    
  );
};

export default TicketOverViewPage;