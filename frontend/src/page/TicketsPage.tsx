import DashboardLayout from '@/layouts/DashboardLayout';
import { getSpecificTicket, getTickets } from '@/utils/action';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';

import type { ticket } from '../../../types';
import { useLocation } from 'react-router';
import { DataTable } from '@/components/ticket/data-table';
import { columns } from '@/components/ticket/columns';
import Spinner from '@/components/Spinner';
import { Card } from '@/components/ui/card';

const TicketsPage = () => {
  const {pathname}=useLocation();
  
      const [tickets,setTicket]=useState<ticket[]>([])
    useEffect(()=>{
        const getMyTickets=async()=>{
            const res=await getSpecificTicket(pathname);
            setTicket(res);
            
            console.log(res);
            
        }
        getMyTickets();
    },[pathname])

  return (
    <DashboardLayout>
      <Card className='flex item-center bg-white border-none shadow-2xl w-full p-5 min-h-screen justify-start'>

      {(tickets&&tickets.length)? <DataTable columns={columns} data={tickets} />:<Spinner/>}
      </Card>
    </DashboardLayout>
  );
};

export default TicketsPage;