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
import Button from '@/components/ui/Button';

const TicketsPage = () => {
  const [showModal,setShowModal]=useState(false)
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
     setShowModal(false);
     setSelectedTicket(null);  
     setTriggerRerender(Math.random()) 
     
    }
  return (
    <DashboardLayout>
      <Card className='flex item-center bg-white border-none shadow-2xl w-full p-5 min-h-screen justify-start'>

      {(tickets&&!pending)?(
        <div className='flex flex-col w-full h-full'>
          <FilterTableDiv organisations={organisations} />
         <DataTable columns={columns({handleTakeInCharge:(selectedticket:ticket)=>{
          setShowModal(true);
          setSelectedTicket(selectedticket);
          
         }})} data={tickets} />
         <TablePagination maxPages={Math.ceil(totalTicketsSize/10)} className='mt-auto ml-auto gap-2 p-5'/>
        </div>
      ):<Spinner/>}
      </Card>
      <div>
        <Modal 
        close={()=>setShowModal(false)}
        showModal={showModal}
        title={"Prendre en charge le Ticket"}

        >
          <div className='flex flex-col gap-4'>
          <p>Êtes-vous sûr de vouloir prendre en charge ce ticket</p>
          <div className='flex mx-10 justify-between items-center'>
            <Button variant='primary' className='bg-red-400' text='Non' onClick={()=>setShowModal(false)} />
            <Button variant='primary' text='Oui' onClick={()=>handleTakeInCharge()}/>
          </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default TicketsPage;