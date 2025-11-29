import DashboardLayout from '@/layouts/DashboardLayout';
import { getSpecificTicket, getTickets } from '@/utils/action';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';

import type { ticket } from '../../../types';
import { useLocation, useSearchParams } from 'react-router';
import { DataTable } from '@/components/ticket/data-table';
import { columns } from '@/components/ticket/columns';
import Spinner from '@/components/Spinner';
import { Card } from '@/components/ui/card';
import TablePagination from '@/components/TablePAgination';

const TicketsPage = () => {
  const [searchParams,setSearchParams]=useSearchParams();
   const [totalTicketsSize,setTotalTicketsSize]=useState(0);
   const [pending,setPending]=useState(false);
  const page=searchParams.get("page")||1;
  const {pathname}=useLocation();
  
      const [tickets,setTicket]=useState<ticket[]>([])
    useEffect(()=>{
     
        const getMyTickets=async()=>{
           setPending(true)
           setTicket([]);
            const res=await getSpecificTicket(pathname,{page});
            setTicket(res.data);
            setTotalTicketsSize(res.total);
            console.log(res);
            setPending(false)
        }
        getMyTickets();
    },[pathname,page])

  return (
    <DashboardLayout>
      <Card className='flex item-center bg-white border-none shadow-2xl w-full p-5 min-h-screen justify-start'>

      {(tickets&&!pending)?(
        <div className='flex flex-col w-full h-full'>

         <DataTable columns={columns} data={tickets} />
         <TablePagination maxPages={Math.ceil(totalTicketsSize/10)} className='mt-auto ml-auto gap-2 p-5'/>
        </div>
      ):<Spinner/>}
      </Card>
    </DashboardLayout>
  );
};

export default TicketsPage;