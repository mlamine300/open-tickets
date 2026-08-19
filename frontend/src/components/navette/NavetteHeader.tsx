import type { Organisation } from '@/types'
import  {  useEffect, useState } from 'react'
import Input from '../ui/Input';
import SelectWithSearch from '../ui/SelectWithSearch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useSearchParams } from 'react-router';
import { formatDate } from 'date-fns';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import AddNavette from './AddNavette';

const NavetteHeader = ({organisations}:{organisations:Organisation[]}) => {
    const role=localStorage.getItem("role")||"standard"
    const [searchParams, setSearchParams] = useSearchParams();
    const [showModal, setShowModal] = useState(false);
    const params = new URLSearchParams(searchParams);
    const [filterDateStart, setFilterDateStart] = useState<string>(searchParams.get("start_date") ||"2026-01-01");
    const [filterDateEnd, setFilterDateEnd] = useState<string>(searchParams.get("end_date") ||formatDate(new Date(),"yyyy-MM-dd"));
    const [choosenOrganisationId, setChoosenOrganisationId] = useState<string>(searchParams.get("organiastion") ||"");



  const updateParam = (key: string, value: string | boolean | undefined) => {
    
        if (value) params.set(key, String(value));
        else params.delete(key);
      };

      useEffect(()=>{
         updateParam("start_date", filterDateStart);
         updateParam("end_date", filterDateEnd);
         updateParam("organisation", choosenOrganisationId);

         setSearchParams(params)
      },[filterDateEnd,filterDateStart,choosenOrganisationId])

      
  return (
    <div className='flex flex-col p-1 '>
   

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className='py-0'>
          <h3 className='font-black text-text-primary text-lg italic underline hover:text-xl'>
            Filtres
          </h3>
        </AccordionTrigger>
        <AccordionContent className="flex gap-8 items-center justify-center">
        
        <Input 
        parentClassName="bg-background-base flex flex-col items-start gap-0"
        labelClassName={"capitalize w-full flex text-xs italic "}
        type='date' label='navette arrivéé le (date de début)'
        onChange={(e)=>setFilterDateStart(e.target.value)}
        value={filterDateStart||"2026-01-01"}
        placeHolder='2000-01-01'  />
         
          <Input
           parentClassName="bg-background-base flex flex-col items-start gap-0"
           labelClassName={"capitalize w-full flex text-xs italic "}
           type='date'
           label='navette arrivéé le (date de fin)'
           onChange={(e)=>setFilterDateEnd(e.target.value)}
           value={filterDateEnd||""}
           placeHolder='2100-01-01'  />
       
            {role!=="standard"&&(
                <div className={"bg-background-base flex flex-col items-start gap-2 justify-center"}>
                <label className={'capitalize w-full flex text-xs italic '} htmlFor={`select-organisation`}>Organisation / Station </label>
             <SelectWithSearch label='Organisation' possibleValues={organisations.map(o=>o.name)} name='organisation'
          value={organisations.find(o=>o._id===choosenOrganisationId)?.name||""} onValueChange={(s)=>setChoosenOrganisationId(organisations.find(o=>o.name===s)?._id||"")} />
       
       
        </div>
    )
    }

    <Button text='Ajouter la navette de jour' variant='primary' className='mt-2' onClick={()=>setShowModal(true)}  />
          
               

               </AccordionContent>
               </AccordionItem>
     </Accordion>
     <Modal 
            className="flex flex-col justify-between py-10 overflow-y-auto max-h-9/12 h-fit min-h-6/12"
            close={()=>setShowModal(false)} showModal={showModal} title="Ajouter la navette de jour" >
             <AddNavette navette={null} closeModal={()=>setShowModal(false)}/>
                </Modal>
    </div>
  )
}

export default NavetteHeader
