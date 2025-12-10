import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { FormType } from '@/types';

import {   getFormsAction } from '@/actions/formAction';

import DynamicForm from '@/components/ticket/Formulaire';




const AddTicketFormPage = () => {
     const [form,setForm]=useState<FormType|null>(null)
     
     
    const { id } = useParams();
      // const[organisations,setOrganisations]=useState<Organisation[]>([]);
      useEffect(()=>{
      
          const getForm=async()=>{
;
       if(id&&id!=="standard") {
            const forms=await getFormsAction() as FormType[];
            const localform=forms.filter(f=>f._id===id).at(0);
            if(localform){
              setForm(localform)
              console.log(localform);
              
            }
             }
           
           
        }
        
        getForm();
      
      },[])
   
   
    
    return (
    
        <div className='w-full flex flex-col items-center'>

       
       
<DynamicForm form={form} />
        </div>
        
        
      
    );
};

export default AddTicketFormPage;