import React, { useEffect, useState } from 'react';
import type{ FormType } from '../../../../types';
import { getFormsAction } from '@/actions/action';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Pen, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router';

const FormsPages = () => {
  const [forms,setForms]=useState<FormType[]>([]);
  useEffect(()=>{
    const getForms=async()=>{
   const formsRes=   await getFormsAction();
   setForms(formsRes);
    }
getForms();
  },[])
  return (
    <DashboardLayout >
      <div className='w-11/12  xl:min-w-[1080px]'>
      <Card className='flex flex-col gap-8 w py-8 px-4 bg-background-base rounded-xl shadow-2xl border-none max-w-[800px] items-center'>
      <h3 className='text-lg font-semibold'>Créer / Editer / Supprimer des formulaires </h3>
      <div className='flex flex-col gap-4 w-full'>
      {forms.map(form=>
      <div className='flex gap-2 items-center bg-background-base shadow-2xl rounded-lg py-4 px-2 max-w-[600px]'>
       <div className='flex flex-col items-start py-2'>
        
        <h3 className='text-sm font-semibold'>{form.name}</h3>
        <p className='text-xs italic font-light ml-2'><span className='font-bold text-gray-cold italic '>description :</span> {form.description} </p>
       </div>
        <div className='ml-auto flex gap-4 items-center'>
            
          <Link to={`/forms/${form._id}`}>
          <Pen className='hover:scale-110 cursor-pointer'/></Link>
          <Trash2 className='text-red-500 hover:scale-110 hover:text-red-600 hover:-rotate-12 cursor-pointer'/>
        </div>
      </div>)}
      </div>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default FormsPages;