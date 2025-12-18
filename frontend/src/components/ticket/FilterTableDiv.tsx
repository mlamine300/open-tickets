import { cn } from '@/lib/utils';
import  { useState, useEffect } from 'react';
import type { Organisation } from '@/types';
import Input from '../ui/Input';
import { useSearchParams } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { PRIORITY_DATA } from '@/data/data';

import { AccordionContent,Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';

const FilterTableDiv = ({className,organisations}:{className?:string,organisations?:Organisation[]}) => {
 const [searchParams,setSearchParams]=useSearchParams();
    const [search,setSearch]=useState(searchParams.get("search")||"");
    const [emitterOrganization,setEmitterOrganization]=useState(searchParams.get("emitter_organization")||"");
    const [recipientOrganization,setRecipientOrganization]=useState(searchParams.get("recipient_organization")||"");
     const [priority,setPriority]=useState(searchParams.get("priority")||"");

    // Debounce all filter param updates
    useEffect(() => {
      const handler = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        // Search
        if (search) {
          params.set("search", search);
        } else {
          params.delete("search");
        }
        // Emitter Organization
        if (emitterOrganization) {
          params.set("emitter_organization", emitterOrganization);
        } else {
          params.delete("emitter_organization");
        }
        // Recipient Organization
        if (recipientOrganization) {
          params.set("recipient_organization", recipientOrganization);
        } else {
          params.delete("recipient_organization");
        }
        // Status
        if (status) {
          params.set("status", status);
        } else {
          params.delete("status");
        }
        // Priority
        if (priority) {
          params.set("priority", priority);
        } else {
          params.delete("priority");
        }
        setSearchParams(params);
      }, 300);
      return () => clearTimeout(handler);
    }, [search, emitterOrganization, recipientOrganization, priority, setSearchParams, searchParams]);
    return (
<Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>
            <h3 className='font-black text-text-primary text-lg italic underline hover:text-xl'>
                Filtres et recherche
            </h3>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <div className='flex flex-col gap-0 justify-around my-8'>


 <div className={cn("flex flex-col gap-1 md:grid md:grid-cols-2 lg:grid-cols-3 w-full md:min-h-24 md:gap-4",className)}>
     
        
   {organisations&&
   
                <div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>"Organisation Emitrice" </label>
                <Select 
                value={emitterOrganization}
                onValueChange={(value) => setEmitterOrganization( value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`station emmitrice`} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-station-emmitrice`} className="bg-background-base ">
                   <p className='text-sm hover:cursor-pointer'  onClick={()=>setEmitterOrganization("")}>
                    Organisation
                  </p>
                  { organisations?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val.name} value={val._id||"--"}>
                      {val.name}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
              </div>}
                 {organisations&&
                 
                  
<div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>"Organisation Destinatrice" </label>
             
                 <Select 
                value={recipientOrganization}
                onValueChange={(value) => setRecipientOrganization( value)}
              >
                
                <SelectTrigger id='select-emitterOrganisations' className={"w-full"}>
                  <SelectValue  placeholder={`station destinataire`} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-station-destinataire`} className="bg-background-base ">
                  
                 

                 <p className='text-sm hover:cursor-pointer'  onClick={()=>setRecipientOrganization("")}>
                    Organisation
                  </p>
                  { organisations?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val.name} value={val._id||"---"}>
                      {val.name}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
              </div>}
             

               <div className={"flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-priority`}>Priority </label>
             
            <Select 
                value={priority}
                onValueChange={(value) => setPriority( value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`priority`} />
                  
                </SelectTrigger>
                
                 
                <SelectContent  id={`select-status`} className="bg-background-base ">
                  
                
                  <p className='text-sm hover:cursor-pointer'  onClick={()=>setPriority("")}>
                    Priority
                  </p>
                 
                  { PRIORITY_DATA?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val.value} value={val.value}>
                      {val.label}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
              </div>
     
    </div>
    <form className='flex justify-end items-center'>
    <div className='flex justify-between'>

    <Input parentClassName='flex flex-row items-center gap-2' containerClassName='h-10' label=' Recherche :' labelClassName='' type='text' placeHolder='rechercher par ref, agent' value={search} onChange={(e)=>setSearch(e.target.value)} />
      <button className='hover:font-bold italic underline' onClick={()=>{
        setEmitterOrganization("");
        setRecipientOrganization("");
        setPriority("");
        setSearch("");
      }}>Reset</button>            
      </div>
</form>
   </div>
        </AccordionContent>
      </AccordionItem>
      </Accordion>

  
  );
};

export default FilterTableDiv;