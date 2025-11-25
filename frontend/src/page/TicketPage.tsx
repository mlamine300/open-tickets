import DashboardLayout from '@/layouts/DashboardLayout';
import { getSpecificTicket, getTickets } from '@/utils/action';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';

import type { ticket } from '../../../types';
import { useLocation } from 'react-router';

const TicketPage = () => {
  const {pathname}=useLocation();
  
      const [ticket,setTicket]=useState<ticket[]>([])
    useEffect(()=>{
        const getMyTickets=async()=>{
            const res=await getSpecificTicket(pathname);
            
            
            console.log(res);
            
        }
        getMyTickets();
    },[pathname])
  return (
    <DashboardLayout>
      <h1>Component</h1>
    </DashboardLayout>
  );
};

export default TicketPage;