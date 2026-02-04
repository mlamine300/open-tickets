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
import TicketsTable from './TicketsTable';

const TicketsPage = () => {
//    const [tickets,setTicket]=useState<ticket[]>([]);
   const [showModal,setShowModal]=useState<string>("")
   const [selectedTicket,setSelectedTicket]=useState<ticket|null>(null);
//   const [searchParams]=useSearchParams();
  
   const [organisations,setOrganisations]=useState<Organisation[]>([]);
   useEffect(()=>{
          const retrieveOrganisations = async () => {
        const organisationsFromAction = await getAllorganisationsAction();
        setOrganisations(organisationsFromAction);
      };
      retrieveOrganisations();
   },[])
   
//    const [pending,setPending]=useState(false);
    const [triggerRerender,setTriggerRerender]=useState(0);
//   const page=searchParams.get("page")||1;
//     const search=searchParams.get("search")||"";
//     const motif=searchParams.get("motif")||"";
//     const emitterOrganizationId=searchParams.get("emitter_organization")||"";
//     const recipientOrganizationId=searchParams.get("recipient_organization")||"";
//     const onlyMyOrganisation=searchParams.get("notag");
    
//     const priority=searchParams.get("priority")||"";
//   const {pathname}=useLocation();
  
     
//     useEffect(() => {
//       let intervalId;
//       const getMyTickets = async () => {
//         setPending(true);
//         setTicket([]);
//         const res = await getSpecificTicketAction(pathname, { page, search,motif, emitterOrganizationId, recipientOrganizationId, priority,notag:onlyMyOrganisation });
//         setTicket(res.data);
//         setTotalTicketsSize(res.total);
//         setPending(false);
//       };
//       const retrieveOrganisations = async () => {
//         const organisationsFromAction = await getAllorganisationsAction();
//         setOrganisations(organisationsFromAction);
//       };
//       getMyTickets();
//       retrieveOrganisations();
//       intervalId = setInterval(() => {
//         setTriggerRerender(Math.random());
//       }, 1*60*1000); // 1 minute
//       return () => {
//         clearInterval(intervalId);
//       };
//     }, [pathname, page,motif,onlyMyOrganisation, priority, emitterOrganizationId, recipientOrganizationId, search, triggerRerender]);

const openConfirmation=(selectedticket:ticket,modalTitle:string)=>{
          setShowModal(modalTitle);
          setSelectedTicket(selectedticket);
          
         }
   
  return (
    <Sheet>
    
      <Card className='flex item-center   border-none shadow-2xl w-fit p-5 min-h-screen justify-start max-w-full'>

      
        <div className='flex flex-col w-full h-full '>
          <FilterTableDiv organisations={organisations} />
        <TicketsTable setShowModal={setShowModal} setTriggerRerender={setTriggerRerender} setSelectedTicket={setSelectedTicket} triggerRerender={triggerRerender} />
         </div>
      
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
    
   {selectedTicket&& <AddCommentSheetContent organisations={organisations} refresh={()=>{
    setTriggerRerender(Math.random())
   }} ticket={selectedTicket} />}
    </Sheet>
  );
};

export default TicketsPage;