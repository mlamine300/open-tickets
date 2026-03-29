import { cn } from '@/lib/utils';
import  { useState, useEffect } from 'react';
import type { Organisation } from '@/types';
import Input from '../ui/Input';
import {  useSearchParams } from 'react-router';

import { getWilayas} from '@/data/data';

import { AccordionContent,Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';
import SelectWithSearch from '../ui/SelectWithSearch';


const FilterTableDiv = ({className}:{className?:string,organisations?:Organisation[]}) => {
  
 const [searchParams,setSearchParams]=useSearchParams();
    const [search,setSearch]=useState(searchParams.get("search")||"");
        const [wilaya,setWilaya]=useState(searchParams.get("wilaya")||"");
        const [active, setActive] = useState(searchParams.get("active")||"");
  const wilayas=getWilayas();
    // Debounce all filter param updates
    useEffect(() => {
      const handler = setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        // Search
        if (search) {
          params.set("search", search);
        } else if(!search) {
          params.delete("search");
        }
        if (wilaya) {
          params.set("wilaya", wilaya);
        } else if(!wilaya) {
          params.delete("wilaya");
        }
       if (active) {
          params.set("active", active+"");
        } else if(!active) {
          params.delete("active");
        }
       
        setSearchParams(params);
      }, 300);
      return () => clearTimeout(handler);
    }, [search,wilaya, setSearchParams, searchParams,active]);
    
  
    
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


            <div className={cn("flex flex-col gap-1 md:grid md:grid-cols-2 lg:grid-cols-3 w-full md:gap-4",className)}>
      <Input parentClassName='flex flex-col items-start gap-0' containerClassName='w-11/12 min-w-11/12' labelClassName='text-xs italic' label='Recherche' placeHolder='Station X' type='text' onChange={(e)=>setSearch(e.target.value)} value={search} />
    {wilayas&&
                 
                  
<div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>Wilaya </label>
             <SelectWithSearch label='Organisation Destinatrice' name='Organisation Destinatrice' onValueChange={(o)=>setWilaya(o)} value={wilaya} possibleValues={wilayas} />
               
              </div>}
 <div className={" flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-emitterOrganisations`}>Active </label>
             <SelectWithSearch label='Organisation Active' name='Organisation Active' onValueChange={(o)=>setActive(o)} value={active} possibleValues={["true","false"]} />
               
              </div>
  
    </div>
    <div className='flex flex-col-reverse max-lg:self-center  lg:flex-row lg:justify-between gap-4 lg:gap-8 lg:items-center px-8 mt-5'>

   
   
      </div>
   </div>
        </AccordionContent>
      </AccordionItem>
      </Accordion>

  
  );
};

export default FilterTableDiv;