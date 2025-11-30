import DashboardLayout from '@/layouts/DashboardLayout';
import { getAllorganisations, getSpecificTicket, getTickets, TakeTicketIncharge } from '@/utils/action';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';

import type { Organisation, ticket } from '../../../types';
import { useLocation, useSearchParams } from 'react-router';
import { DataTable } from '@/components/ticket/data-table';
import { columns } from '@/components/ticket/columns';
import Spinner from '@/components/Spinner';
import { Card } from '@/components/ui/card';
import TablePagination from '@/components/TablePAgination';
import FilterTableDiv from '@/components/FilterTableDiv';
import Modal from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/sheet';
import AddCommentSheetContent from '@/components/AddCommentSheetContent';
import ConfirmTakeInCharge from './ConfirmTakeInCharge';
import TicketViewOnModal from './TicketViewOnModal';
import { cn } from '@/lib/utils';

const TicketsPage = () => {
  const [showModal,setShowModal]=useState<string>("")
  const [selectedTicket,setSelectedTicket]=useState<ticket|null>(null);
  const [searchParams,setSearchParams]=useSearchParams();
  const [organisations,setOrganisations]=useState<Organisation[]>();
   const [totalTicketsSize,setTotalTicketsSize]=useState(0);
   const [pending,setPending]=useState(false);
   const [triggerRerender,setTriggerRerender]=useState(0);
  const page=searchParams.get("page")||1;
    const search=searchParams.get("search")||"";
    const emitterOrganizationId=searchParams.get("emitter_organization")||"";
    const recipientOrganizationId=searchParams.get("recipient_organization")||"";
    
    
    const priority=searchParams.get("priority")||"";
  const {pathname}=useLocation();
  
      const [tickets,setTicket]=useState<ticket[]>([])
    useEffect(()=>{
     
        const getMyTickets=async()=>{
           setPending(true)
           setTicket([]);
            const res=await getSpecificTicket(pathname,{page,search,emitterOrganizationId,recipientOrganizationId,priority});
            setTicket(res.data);
            setTotalTicketsSize(res.total);
            console.log(res);
            setPending(false)
        }
        const retrieveOrganisations=async()=>{
          const organisationsFromAction=await getAllorganisations();
          setOrganisations(organisationsFromAction)
        }
        getMyTickets();
        retrieveOrganisations();
    },[pathname,page,priority,emitterOrganizationId,recipientOrganizationId,search,triggerRerender])

    const handleTakeInCharge=()=>{
      if(!selectedTicket){
        alert("please select a ticket before action")
        return;
      } 
     TakeTicketIncharge(selectedTicket._id);
     setShowModal("");
     setSelectedTicket(null);  
     setTriggerRerender(Math.random()) 
     
    }
  return (
    <Sheet>
    <DashboardLayout>
      <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>

      {(tickets&&!pending)?(
        <div className='flex flex-col w-full h-full'>
          <FilterTableDiv organisations={organisations} />
         <DataTable columns={columns({handleTakeInCharge:(selectedticket:ticket)=>{
          setShowModal("confirmation");
          setSelectedTicket(selectedticket);
          
         },addComment:(ticket:ticket)=>setSelectedTicket(ticket),
         showTicket:(ticket:ticket)=>{
          setShowModal("ticket");
          setSelectedTicket(ticket);
         }
         
         
         })} data={tickets} />
         <TablePagination maxPages={Math.ceil(totalTicketsSize/10)} className='mt-auto ml-auto gap-2 p-5'/>
        </div>
      ):<Spinner/>}
      </Card>
      <div>
        <Modal 
        close={()=>setShowModal("")}
        showModal={(Boolean(showModal))}
        title={showModal==="confirmation"?"Prendre en charge le Ticket":"Detail de Ticket"}
        className={cn(showModal==="ticket"&&" md:min-w-8/12 min-h-10/12 ")}

        >
         {showModal==="confirmation"?<ConfirmTakeInCharge handleTakeInCharge={handleTakeInCharge} setShowModal={setShowModal}/>:showModal==="ticket"&&selectedTicket?<TicketViewOnModal ticket={selectedTicket} />:<div/>}
        </Modal>
      </div>
    </DashboardLayout>
   {selectedTicket&& <AddCommentSheetContent ticket={selectedTicket} />}
    </Sheet>
  );
};

export default TicketsPage;