import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { Organisation } from '@/types';
import Input from '../ui/Input';
import { useLocation, useSearchParams } from 'react-router';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {  PRIORITY_DATA } from '@/data/data';
import { AccordionContent, Accordion, AccordionItem, AccordionTrigger } from '../ui/accordion';
import SelectWithSearch from '../ui/SelectWithSearch';
import { FaFileExcel } from 'react-icons/fa6';
import { donwloadExcel } from '@/actions/ticketAction'; 
import { DropdownMenuRadio } from '../main/DropDownMenuRadio';

const FilterTableDiv = ({ className, organisations,motifs }: { className?: string, organisations?: Organisation[];motifs:string[] }) => {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  // 1. Initialize state directly from URL parameters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [motif, setMotif] = useState(searchParams.get("motif") || "");
  const [onlyMyOrganisation, setOnlyMyOrganisation] = useState(searchParams.get("notag") === "true");
  const [perPage, setPerPage] = useState<string>("10");
  // Use .find() instead of .filter().at(0) for better performance
  const emitterOrganisationName = searchParams.get("emitter_organization") 
    ? organisations?.find(o => o._id === searchParams.get("emitter_organization"))?.name || "----" 
    : "";
  const [emitterOrganization, setEmitterOrganization] = useState(emitterOrganisationName);

  const recipientOrganisationName = searchParams.get("recipient_organization") 
    ? organisations?.find(o => o._id === searchParams.get("recipient_organization"))?.name || "----" 
    : "";
  const [recipientOrganization, setRecipientOrganization] = useState(recipientOrganisationName);
  
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [pending, setPending] = useState(false);
  
  const organisationsName = organisations?.map(o => o.name);

  // 2. Single effect to sync State -> URL Params (Debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      const updateParam = (key: string, value: string | boolean | undefined) => {
        if (value) params.set(key, String(value));
        else params.delete(key);
      };
     
      updateParam("search", search);
      updateParam("motif", motif);
      updateParam("priority", priority);
      updateParam("notag", onlyMyOrganisation ? "true" : "");
      updateParam("per_page",perPage)

      const emitterId = organisations?.find(o => o.name === emitterOrganization)?._id;
      updateParam("emitter_organization", emitterId);

      const recipientId = organisations?.find(o => o.name === recipientOrganization)?._id;
      updateParam("recipient_organization", recipientId);
      params.delete("page");
      setSearchParams(params);
    }, 300);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, motif, onlyMyOrganisation, emitterOrganization, recipientOrganization, priority,perPage]);
// Sync URL Params -> State (Handles browser Back/Forward or external URL changes)
  useEffect(() => {
   
    const pSearch = searchParams.get("search") || "";
    const pMotif = searchParams.get("motif") || "";
    const pPriority = searchParams.get("priority") || "";
    const pNotag = searchParams.get("notag") === "true";
    const pPerPage = searchParams.get("per_page") || "10";

    const pEmitterId = searchParams.get("emitter_organization");
    const pEmitterName = pEmitterId 
      ? organisations?.find(o => o._id === pEmitterId)?.name || "" 
      : "";

    const pRecipientId = searchParams.get("recipient_organization");
    const pRecipientName = pRecipientId 
      ? organisations?.find(o => o._id === pRecipientId)?.name || "" 
      : "";

    // The safe way: Only update state if the URL value is actually different!
    setSearch(prev => prev !== pSearch ? pSearch : prev);
    setMotif(prev => prev !== pMotif ? pMotif : prev);
    setPriority(prev => prev !== pPriority ? pPriority : prev);
    setOnlyMyOrganisation(prev => prev !== pNotag ? pNotag : prev);
    setEmitterOrganization(prev => prev !== pEmitterName ? pEmitterName : prev);
    setRecipientOrganization(prev => prev !== pRecipientName ? pRecipientName : prev);
   
    setPerPage((prev) => prev !== pPerPage ? pPerPage : prev)

  }, [pathname]);
  // Handle Reset cleanly
  const handleReset = () => {
    setEmitterOrganization("");
    setRecipientOrganization("");
    setPriority("");
    setSearch("");
    setMotif("");
    setOnlyMyOrganisation(false);
  };

  const handleDownloadExcel = async () => {
    try {
      setPending(true);
      await donwloadExcel(pathname);
    } catch (error) {
      console.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger className='py-0'>
          <h3 className='font-black text-text-primary text-lg italic underline hover:text-xl'>
            Filtres et recherche
          </h3>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <div className='flex flex-col gap-0 justify-around my-2'>
            <div className={cn("flex flex-col gap-1 md:grid md:grid-cols-2 lg:grid-cols-3 w-full md:min-h-24 md:gap-2", className)}>
              
              {organisations && (
                <div className="flex flex-col items-start gap-0">
                  <label className='w-full flex text-xs italic'>Organisation Emémettrice</label>
                  <SelectWithSearch label='Organisation Emémettrice' name='organisation_emitrice' onValueChange={setEmitterOrganization} value={emitterOrganization} possibleValues={organisationsName} />
                </div>
              )}

              {organisations && (
                <div className="flex flex-col items-start gap-0">
                  <label className='w-full flex text-xs italic'>Organisation Destinatrice</label>
                  <SelectWithSearch label='Organisation Destinatrice' name='Organisation Destinatrice' onValueChange={setRecipientOrganization} value={recipientOrganization} possibleValues={organisationsName} />
                </div>
              )}

              <div className="flex flex-col items-start gap-0">
                <label className='w-full flex text-xs italic'>Motif</label>
                <SelectWithSearch label='Motif' name='motif' onValueChange={setMotif} value={motif} possibleValues={motifs} />
              </div>

              <div className="flex flex-col items-start gap-0">
                <label className='w-full flex text-xs italic'>Priorité</label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent className="bg-background-base">
                    <p className='text-sm hover:cursor-pointer p-2' onClick={() => setPriority("")}>
                      Priorité
                    </p>
                    {PRIORITY_DATA?.map((val) => (
                      <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val.value} value={val.value}>
                        {val.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Accessible custom toggle */}
              <div 
                onClick={() => setOnlyMyOrganisation(b => !b)} 
                onKeyDown={(e) => e.key === 'Enter' && setOnlyMyOrganisation(b => !b)}
                role="button"
                tabIndex={0}
                className="grid grid-cols-2 cursor-pointer rounded-2xl items-start gap-0 w-72 lg:max-w-72 mt-4 md:mt-0"
              >
                <div className={`flex items-center justify-center w-full h-full rounded-l-2xl min-h-8 transition-colors ${onlyMyOrganisation ? "bg-gray-hot" : "bg-primary text-white"}`}>
                  <p className='text-sm italic'>Tous</p>
                </div>
                <div className={`flex items-center justify-center w-full h-full rounded-r-2xl min-h-8 transition-colors ${onlyMyOrganisation ? "bg-primary text-white" : "bg-gray-hot"}`}>
                  <p className='text-sm italic'>Me Concerne</p>
                </div>
              </div>
            </div>

            <div className='flex flex-col-reverse max-lg:self-center lg:flex-row lg:justify-between gap-4 lg:gap-8 lg:items-center px-8 mt-4'>
            <div className='flex gap-4'>

            <DropdownMenuRadio buttonTitle={`Ticket Par Page : ${perPage}`} title={"Ticket Par Page"} choosen={perPage} setChoosen={setPerPage} list={["5","10","25","50"]} />
              <button
                onClick={handleDownloadExcel}
                disabled={pending}
                className="flex w-fit gap-4 items-center h-fit px-4 py-1 border text-primary border-gray-hot rounded-lg hover:font-semibold hover:border-primary bg-white shadow-2xl disabled:text-gray-cold transition-all"
                >
                Télécharger le tableau
                <FaFileExcel />
              </button>
                </div>

              {/* Changed <form> to <div> to avoid accidental submissions, or use onSubmit={(e)=>e.preventDefault()} */}
              <div className='flex flex-row items-center gap-4'>
                <Input parentClassName='flex flex-row items-center gap-2 w-fit lg:w-full' containerClassName='h-10' label='Recherche :' labelClassName='text-xs hidden lg:flex' type='text' placeHolder='rechercher par ref, agent' value={search} onChange={(e) => setSearch(e.target.value)} />
                
                {/* Critical: type="button" added */}
                <button type="button" className='hover:font-bold italic underline whitespace-nowrap' onClick={handleReset}>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FilterTableDiv;