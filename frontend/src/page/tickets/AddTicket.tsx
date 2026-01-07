import  { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { Link } from 'react-router';
import type { FormFieldType, FormType, Organisation } from '@/types';
import { getStandardForm } from '@/data/data';
import DynamicForm from '@/components/ticket/Formulaire';
//import { getAllorganisationsAction } from '@/actions/organisationAction';
import { getFormsAction } from '@/actions/formAction';
import { getAllorganisationsAction } from '@/actions/organisationAction';

const AddTicket = () => {
    
   const [standardForm, setStandardForm] = useState<FormType|null>(null);

    const[forms,setForms]=useState<FormType[]|null>(null);
    
    
    useEffect(()=>{

     
        const getForms=async()=>{
          try {
              const myorganisation=await getAllorganisationsAction(); 
            const localForms=await getFormsAction() as FormType[];
            // localForms.forEach(f=>{
            //   f.fields.forEach((field:FormFieldType)=>{
            //     if(field.possibleValues&&Array.isArray(field.possibleValues)&&field.possibleValues.length>0&&field.possibleValues.at(0)?.toLowerCase()==="organisations"){
            //       field.possibleValues=myorganisation.map(o=>o.name);
            //     }
            //   })
            // })
            const fetchedStandartForm=getStandardForm();
            fetchedStandartForm.fields.map((field:FormFieldType)=>
            {
              if(field.possibleValues&&Array.isArray(field.possibleValues)&&field.possibleValues.length>0&&field.possibleValues.at(0)?.toLowerCase()==="organisations"){
                  field.possibleValues=myorganisation.map(o=>o.name);
                }
            }
            )
            setStandardForm(fetchedStandartForm)
            setForms(localForms);
            
          } catch (error) {
            console.log(error);
            
          }
          
          
        }
      
        getForms();
        
       
    },[])
    
    

  return (
    <div>
      <div className='flex flex-col items-center gap-4'>
        <h1 className='text-2xl font-semibold italic text-primary'>Portail des réclamations</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            
         <Link to={`/form/${standardForm?._id||""}`} className='lg:hidden w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-hot/80 border-gray-cold max-w-80 py-2 px-5'>
        <h3>{standardForm?.name||"-"}</h3>
        <p>{standardForm?.description||"-"} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>
       {
        (forms&&forms.length)&&
       (forms.map(f=><Link key={f._id} to={`/form/${f._id}`} className='w-full min-h-36 gap-4 items-start rounded shadow-2xl flex flex-col  border bg-gray-hot/80 border-gray-cold max-w-80 py-2 px-5'>
        <h3>{f.name}</h3>
        <p>{f.description} </p>
        <FaArrowRight className='ml-auto text-primary text-2xl font-bold'/>
        </Link>))
       }

        

      </div>
      {standardForm&&<div className='w-8/12 self-center hidden lg:flex'>
        <DynamicForm form={standardForm}  />
      </div>}
      </div>
    </div>
  );
};

export default AddTicket;