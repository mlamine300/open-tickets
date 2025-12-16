import { cn } from '@/lib/utils';
import  { useState, useEffect } from 'react';
import type { Organisation } from '@/types';
import Input from '../ui/Input';
import { useSearchParams } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { AccordionContent,Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';

const FilterTableDiv = ({className,organisations}:{className?:string,organisations?:Organisation[]}) => {
 const [searchParams,setSearchParams]=useSearchParams();
    const [search,setSearch]=useState(searchParams.get("search")||"");
    const [organisation,setOrganisation]=useState(searchParams.get("organisation")||"");
      const [type,setType]=useState(searchParams.get("type")||"");

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
        if (organisation) {
          params.set("organisation",organisation);
        } else {
          params.delete("organisation");
        }
        
        // Status
        if (type) {
          params.set("type", type);
        } else {
          params.delete("type");
        }
     
        setSearchParams(params);
      }, 300);
      return () => clearTimeout(handler);
    }, [search, type,organisation, setSearchParams, searchParams]);
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


 <div className={cn("flex flex-col gap-1 md:grid md:grid-cols-2 lg:grid-cols-3 w-full md:min-h-16 md:gap-4",className)}>
     
        
   {organisations&&
   
                <div className={"bg-background-base flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-Organisations`}>"Organisation" </label>
                <Select 
                value={organisation}
                onValueChange={(value) => setOrganisation( value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`organisation`} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-station`} className="bg-background-base ">
                   <p className='text-sm hover:cursor-pointer'  onClick={()=>setOrganisation("")}>
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
             
             

               <div className={"bg-background-base flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-priority`}>Type </label>
             
            <Select 
                value={type}
                onValueChange={(value) => setType( value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`Type`} />
                  
                </SelectTrigger>
                
                 
                <SelectContent  id={`select-status`} className="bg-background-base ">
                  
                
                  <p className='text-sm hover:cursor-pointer'  onClick={()=>setType("")}>
                    Type
                  </p>
                 
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={"supervisor"} value={"supervisor"}>
                      Supervisor
                    </SelectItem>
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={"standard"} value={"standard"}>
                      Standard
                    </SelectItem>
                  
                </SelectContent>
                
              </Select>
              </div>
     
    </div>
    <form className='flex justify-end items-center'>
    <div className='flex justify-between'>

    <Input parentClassName='flex flex-row items-center gap-2' containerClassName='h-10' label=' Recherche :' labelClassName='' type='text' placeHolder='rechercher par ref, agent' value={search} onChange={(e)=>setSearch(e.target.value)} />
      <button className='hover:font-bold hover:underline' onClick={()=>{
        setOrganisation(""); 
        setType("");
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