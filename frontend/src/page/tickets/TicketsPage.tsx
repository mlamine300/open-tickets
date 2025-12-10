import {  getSpecificTicketAction } from '@/actions/ticketAction';
import {getAllorganisationsAction} from "@/actions/organisationAction";
import { useEffect, useState } from 'react';

import type { Organisation, ticket } from '@/types';
import { useLocation, useSearchParams } from 'react-router';
import { DataTable } from '@/components/ticket/data-table';
import { columns } from '@/components/ticket/columns';
import Spinner from '@/components/main/Spinner';
import { Card } from '@/components/ui/card';
import TablePagination from '@/components/ticket/TablePAgination';
import FilterTableDiv from '@/components/ticket/FilterTableDiv';
import Modal from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/sheet';
import AddCommentSheetContent from '@/components/ticket/AddCommentSheetContent';
import TicketViewOnModal from '../../components/ticket/TicketViewOnModal';
import { cn } from '@/lib/utils';

const TicketsPage = () => {
  const [showModal,setShowModal]=useState<string>("")
  const [selectedTicket,setSelectedTicket]=useState<ticket|null>(null);
  const [searchParams,setSearchParams]=useSearchParams();
  console.log(setSearchParams)
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
            const res=await getSpecificTicketAction(pathname,{page,search,emitterOrganizationId,recipientOrganizationId,priority});
            setTicket(res.data);
            setTotalTicketsSize(res.total);
            console.log(res);
            setPending(false)
        }
        const retrieveOrganisations=async()=>{
          const organisationsFromAction=await getAllorganisationsAction();
          setOrganisations(organisationsFromAction)
        }
        getMyTickets();
        retrieveOrganisations();
    },[pathname,page,priority,emitterOrganizationId,recipientOrganizationId,search,triggerRerender])

const openConfirmation=(selectedticket:ticket,modalTitle:string)=>{
          setShowModal(modalTitle);
          setSelectedTicket(selectedticket);
          
         }
    // const handleTakeInChargeConfirmation=()=>{
    //   if(!selectedTicket){
    //     alert("please select a ticket before action")
    //     return;
    //   } 
    //  TakeTicketIncharge(selectedTicket._id);
    //  setShowModal("");
    //  setSelectedTicket(null);  
    //  setTriggerRerender(Math.random()) 
     
    // }
    // const handleClosing=()=>{

    // }
    // const handleFormward=()=>{

    // }
  return (
    <Sheet>
    
      <Card className='flex item-center bg-background-base border-none shadow-2xl w-full p-5 min-h-screen justify-start'>

      {(tickets&&!pending)?(
        <div className='flex flex-col w-full h-full'>
          <FilterTableDiv organisations={organisations} />
         <DataTable columns={columns({actions:{
          addComment:(ticket:ticket)=>setSelectedTicket(ticket),
          // handleTakeInCharge:(ticket:ticket)=>openConfirmation(ticket,"confirmation"),
          // addComment:(ticket:ticket)=>setSelectedTicket(ticket),
         showTicket:(ticket:ticket)=>openConfirmation(ticket,"ticket"),
        //  handleClosing:(ticket:ticket)=>openConfirmation(ticket,"close"),
        //  handleFormward:(ticket:ticket)=>openConfirmation(ticket,"forward"),
        },
         path:pathname
         
         })} data={tickets} />
         <TablePagination maxPages={Math.ceil(totalTicketsSize/10)} className='mt-auto ml-auto gap-2 p-5'/>
        </div>
      ):
      (<div className='w-full h-full flex items-center justify-center'>
        <Spinner size='xl'/>
      </div>)
      }
      </Card>
      <div>
        <Modal 
        close={()=>setShowModal("")}
        showModal={(Boolean(showModal))}
        title={showModal==="confirmation"?"Prendre en charge le Ticket":"Detail de Ticket"}
        className={cn(showModal==="ticket"&&" md:min-w-8/12 min-h-10/12 overflow-y-auto ")}

        >
         {
         (showModal==="ticket"&&selectedTicket)?
         <TicketViewOnModal ticket={selectedTicket} />

        //  :showModal==="confirmation"?
        //  <ConfirmTakeInCharge header='Êtes-vous sûr de vouloir prendre en charge ce ticket' action={handleTakeInChargeConfirmation} setShowModal={setShowModal}/>
         
        //  :(showModal==="close"&&selectedTicket)?
        //   <ConfirmTakeInCharge header='Êtes-vous sûr de vouloir clotorer ce ticket' action={handleClosing} setShowModal={setShowModal}/>
        //  :(showModal==="forward"&&selectedTicket)?<div>forward</div>
        
        :<div/>}
        </Modal>
      </div>
    
   {selectedTicket&& <AddCommentSheetContent refresh={()=>{
    setTriggerRerender(Math.random())
   }} ticket={selectedTicket} />}
    </Sheet>
  );
};

export default TicketsPage;