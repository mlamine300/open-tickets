import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { FormType, Organisation } from '@/types';

import {   getFormsAction } from '@/actions/formAction';

import DynamicForm from '@/components/ticket/Formulaire';
import { getAllorganisationsAction } from '@/actions/organisationAction';
import { getActiveMotifsAction } from '@/actions/motifAction';
import Spinner from '@/components/main/Spinner';




const AddTicketFormPage = () => {
     const [form,setForm]=useState<FormType|null>(null)
     
     
    const { id } = useParams();
       const[organisations,setOrganisations]=useState<Organisation[]>([]);
       const [motifs, setMotifs] = useState<any[]>([]);
      useEffect(()=>{
          const getOrganisations=async()=>{
            const organisationsResp=await getAllorganisationsAction();
            setOrganisations(organisationsResp);
          }

          const getMotifs=async()=>{
            const motifsRes=await getActiveMotifsAction();
            setMotifs(motifsRes)
          }
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
        getOrganisations();
        getMotifs();
        getForm();
      
      },[])
   
   
    
    return (
    
        <div className='w-full flex flex-col items-center'>

       
       
{(organisations.length>0&&motifs.length>0)?<DynamicForm organisations={organisations} motifs={motifs} form={form} /> : (<div className="flex w-full h-screen justify-center items-center">
  <Spinner size="xl" />
 </div>)}
        </div>
        
        
      
    );
};

export default AddTicketFormPage;