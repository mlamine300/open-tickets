import { cn } from '@/lib/utils';
import  { useState, useEffect } from 'react';
import type { Organisation } from '@/types';
import Input from '../ui/Input';
import { useSearchParams } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MOTIFS, PRIORITY_DATA } from '@/data/data';

import { AccordionContent,Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';
import SelectWithSearch from '../ui/SelectWithSearch';

const FilterTableDiv = ({className,organisations}:{className?:string,organisations?:Organisation[]}) => {
 const [searchParams,setSearchParams]=useSearchParams();
    const [search,setSearch]=useState(searchParams.get("search")||"");
    const [motif,setMotif]=useState(searchParams.get("motif")||""); 
    const [onlyMyOrganisation, setOnlyMyOrganisation] = useState(Boolean(searchParams.get("notag"))||false);
    const emmiterOrganisationName=searchParams.get("emitter_organization")?organisations?.filter(o=>o._id===searchParams.get("emitter_organization")).at(0)?.name||"----":""
    const [emitterOrganization,setEmitterOrganization]=useState(emmiterOrganisationName);
     const receiptientOrganisationName=searchParams.get("recipient_organization")?organisations?.filter(o=>o._id===searchParams.get("recipient_organization")).at(0)?.name||"----":""
 
    const [recipientOrganization,setRecipientOrganization]=useState(receiptientOrganisationName);
     const [priority,setPriority]=useState(searchParams.get("priority")||"");
  const organisationsName=organisations?.map(o=>o.name);
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
         // motif
        if (motif) {
          params.set("motif", motif);
        } else {
          params.delete("motif");
        }
        // Emitter Organization
        if (emitterOrganization) {
          const emitterOrganizationId=organisations?.filter(o=>o.name===emitterOrganization).at(0)?._id;
          if(emitterOrganizationId)
          params.set("emitter_organization", emitterOrganizationId);
        } else {
          params.delete("emitter_organization");
        }
        // Recipient Organization
        if (recipientOrganization) {
          const recipientOrganizationId=organisations?.filter(o=>o.name===recipientOrganization).at(0)?._id;
          if(recipientOrganizationId)
          params.set("recipient_organization", recipientOrganizationId);
        } else {
          params.delete("recipient_organization");
        }
        if(onlyMyOrganisation){
          params.set("notag","true")
        }else{
          params.delete("notag");
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
    }, [search,motif,onlyMyOrganisation, emitterOrganization, recipientOrganization, priority, setSearchParams, searchParams]);
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
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>Organisation Emitrice </label>
                {/* <Select 
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
                
              </Select> */}
              
              <SelectWithSearch label='Organisation Emitrice' name='organisation_emitrice' onValueChange={(o)=>setEmitterOrganization(o)} value={emitterOrganization} possibleValues={organisationsName} />
              </div>}
                 {organisations&&
                 
                  
<div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>Organisation Destinatrice </label>
             <SelectWithSearch label='Organisation Destinatrice' name='Organisation Destinatrice' onValueChange={(o)=>setRecipientOrganization(o)} value={recipientOrganization} possibleValues={organisationsName} />
               
              </div>}

       <div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`motif`}>Motif </label>
             <SelectWithSearch label='Motif' name='motif' onValueChange={(m)=>setMotif(m)} value={motif} possibleValues={MOTIFS} />
          
              </div>      

               <div className={"flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-priority`}>Priorité </label>
             
            <Select 
                value={priority}
                onValueChange={(value) => setPriority( value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`Priorité`} />
                  
                </SelectTrigger>
                
                 
                <SelectContent  id={`select-status`} className="bg-background-base ">
                  
                
                  <p className='text-sm hover:cursor-pointer'  onClick={()=>setPriority("")}>
                    Priorité
                  </p>
                 
                  { PRIORITY_DATA?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val.value} value={val.value}>
                      {val.label}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
              </div>
     <div onClick={()=>setOnlyMyOrganisation(b=>!b)} className={` grid grid-cols-2 cursor-pointer rounded-2xl items-start gap-0 w-72 lg:max-w-72`}>
            <div className={`flex items-center justify-center w-full h-full rounded-l-2xl  max-h-8/12 my-auto  ${onlyMyOrganisation?"bg-gray-hot":"bg-primary"}`}>
               <p className='text-sm italic'>Tous</p> 
            </div>
           <div className={`flex items-center justify-center w-full h-full rounded-r-2xl  max-h-8/12 my-auto ${onlyMyOrganisation?"bg-primary":"bg-gray-hot"}`}>
                  <p className='text-sm italic'>Me Concerne</p>
                  </div>
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
      }}>Réinitialiser</button>            
      </div>
</form>
   </div>
        </AccordionContent>
      </AccordionItem>
      </Accordion>

  
  );
};

export default FilterTableDiv;