import DashboardLayout from '@/layouts/DashboardLayout';
import axiosInstance from '@/utils/axiosInstance';
import React, { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router';
import type { FormType } from '../../../types';
import { standardForm } from '@/utils/data';
import DynamicForm from '@/components/Formulaire';
import { buildZodFormSchema } from '@/utils/zod';
import { getAllorganisations } from '@/utils/helper';

const Dashboard = () => {
    
    const[organisations,setOrganisation]=useState<FormType[]>([]);
    const[forms,setForms]=useState<FormType[]|null>(null);
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
        const getOrganisations=async()=>{
          const myorganisation=await getAllorganisations();
          setOrganisation(myorganisation)
        }
        getForms();
        getOrganisations();
    },[])
    const myStandardForm=standardForm(organisations);
const standardSchema=buildZodFormSchema(myStandardForm);
     console.log(forms)
  return (
    <DashboardLayout>
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-2xl font-semibold italic text-primary'>Portail des réclamations</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            
         <Link to={`/form/${myStandardForm._id}`} className='lg:hidden w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-hot/80 border-gray-cold max-w-80 py-2 px-5'>
        <h3>{myStandardForm.name}</h3>
        <p>{myStandardForm.description} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>
       {
        (forms&&forms.length)&&
       (forms.map(f=><Link to={`/form/${f._id}`} className='w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-hot/80 border-gray-cold max-w-80 py-2 px-5'>
        <h3>{f.name}</h3>
        <p>{f.description} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>))
       }

        

      </div>
      <div className='w-8/12 self-center hidden lg:flex'>
        <DynamicForm form={standardForm(organisations)} schema={standardSchema} />
      </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;