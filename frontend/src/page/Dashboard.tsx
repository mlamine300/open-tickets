import DashboardLayout from '@/layouts/DashboardLayout';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router';
import type { Form } from '../../../types';

const Dashboard = () => {
    const standardForm={
        _id:"standard",
        name:"standard",
        description:"reclamation standard",
        fields:[{ name:"message",
        label:"Message",
        type:"text",
        possibleValues:[]}]
    }
    const[forms,setForms]=useState<Form[]|null>(null);
    useEffect(()=>{
        const getForms=async()=>{
            try {
                const res=await axiosInstance.get('/api/forms');
                console.log(res.data.data);
                if(res.status===200){
                    
                    setForms(res.data.data);
                   
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        getForms();
    },[])

     console.log(forms)
  return (
    <DashboardLayout>
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-2xl font-semibold italic text-primary'>Portail des réclamations</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            
         <Link to={`/tickets/${standardForm._id}`} className='lg:hidden w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-200 border-gray-500 max-w-80 py-2 px-5'>
        <h3>{standardForm.name}</h3>
        <p>{standardForm.description} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>
       {
        (forms&&forms.length)&&
       (forms.map(f=><Link to={`/tickets/${f._id}`} className='w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-200 border-gray-500 max-w-80 py-2 px-5'>
        <h3>{f.name}</h3>
        <p>{f.description} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>))
       }

        

      </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;