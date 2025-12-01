import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import type { FormType, Organisation } from '../../../types';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATH } from '@/utils/apiPaths';
import { standardForm, StandartFierlds } from '@/utils/data';
import Formulaire from '@/components/Formulaire';
import { buildZodFormSchema } from '@/utils/zod';
import Spinner from '@/components/Spinner';
import { getAllorganisations, getFormsAction } from '@/utils/action';
import DashboardLayout from '@/layouts/DashboardLayout';



const FormPage = () => {
     const [form,setForm]=useState<FormType|null>(null)
    const { id } = useParams();
      const[organisations,setOrganisations]=useState<Organisation[]>([]);
      useEffect(()=>{
      
          const getForm=async()=>{
          const theorganisations=await getAllorganisations();
          setOrganisations(theorganisations);
        if(!id||id==="standard"){
        setForm(standardForm(theorganisations))
         }else{
            // const res=await axiosInstance.get(API_PATH.FORMS.GET_FORM_BY_ID(id))
            // setForm(res.data.data)
            const forms=await getFormsAction() as FormType[];
            const localform=forms.filter(f=>f._id===id).at(0);
            if(localform){
              setForm(localform)
            }else{
             const res=await axiosInstance.get(API_PATH.FORMS.GET_FORM_BY_ID(id))
             setForm(res.data.data)
            
            }
           
             }
           
        }
        
        getForm();
      
      },[])
   
   
    if(!form || !organisations) return  <DashboardLayout  >
      <div className='w-full h-screen pb-20 flex items-center justify-center '>

      <Spinner size='xl'/>
      </div>
    </DashboardLayout> ;
    console.log(form)
    const schema=buildZodFormSchema(form);
    if(!form.fields.map(f=>f.name).includes("priority"))
    form.fields.push(...StandartFierlds(organisations));
    return (
      <DashboardLayout >
        <div className='w-full flex flex-col items-center'>

       
       
<Formulaire form={form} schema={schema}/>
        </div>
        
        
      </DashboardLayout>
    );
};

export default FormPage;