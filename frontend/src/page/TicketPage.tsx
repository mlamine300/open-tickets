import { getTickets } from '@/utils/action';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect } from 'react';

const TicketPage = () => {
    useEffect(()=>{
        const getMyTickets=async()=>{
            const ticket=await getTickets();
            console.log("-----");
            
            console.log(ticket);
            
        }
        getMyTickets();
    },[])
  return (
    <div>
      <h1>Component</h1>
    </div>
  );
};

export default TicketPage;