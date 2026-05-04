
import {getAllorganisationsAction} from "@/actions/organisationAction";
import { useEffect, useState } from 'react';

import type { Organisation, ticket } from '@/types';

import { Card } from '@/components/ui/card';

import FilterTableDiv from '@/components/ticket/FilterTableDiv';
import Modal from '@/components/ui/Modal';
import { Sheet } from '@/components/ui/sheet';
import AddCommentSheetContent from '@/components/ticket/AddCommentSheetContent';
import TicketViewOnModal from '../../components/ticket/TicketViewOnModal';
import { cn } from '@/lib/utils';
import TicketsTable from './TicketsTable';
import { useUserContext } from "@/context/user/userContext";
import { getActiveMotifsAction } from "@/actions/motifAction";

const TicketsPage = () => {
//    const [tickets,setTicket]=useState<ticket[]>([]);
   const [showModal,setShowModal]=useState<string>("")
   const [selectedTicket,setSelectedTicket]=useState<ticket|null>(null);
//   const [searchParams]=useSearchParams();
  const {setTriggerAppRender}=useUserContext()
   const [organisations,setOrganisations]=useState<Organisation[]>([]);
   const [motifs, setMotifs] = useState<string[]>([]);
   useEffect(()=>{
          const retrieveMotifsAndORganisations = async () => {
        const organisationsFromAction = await getAllorganisationsAction();
        const motifsFromAction=await getActiveMotifsAction();
        setOrganisations(organisationsFromAction);
        setMotifs(motifsFromAction.map((m:any)=>m.name));
      };
     
      retrieveMotifsAndORganisations();
     
   },[])
   

    const [triggerRerender,setTriggerRerender]=useState(0);

   
  return (
    <Sheet>
    
      <Card className='flex item-center   border-none shadow-2xl w-fit p-5 min-h-screen justify-start max-w-full'>

      
        <div className='flex flex-col w-full h-full '>
          <FilterTableDiv motifs={motifs} organisations={organisations} />
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
         <TicketViewOnModal ticket={selectedTicket} isModal={true} />

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
    setTriggerAppRender(Math.random())
   }} ticket={selectedTicket} />}
    </Sheet>
  );
};

export default TicketsPage;