import  { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import Input from './Input';
import { HiXMark } from 'react-icons/hi2';
import { X } from 'lucide-react';

const SelectWithSearch = ({value,onValueChange,label,name,possibleValues}:{value:string;onValueChange:(value:string)=>void;label:string;name:string;possibleValues?:string[]}) => {
  const [search,setSearch]=useState("");
  const [filtredValues,setFiltredValues]=useState(possibleValues);
  useEffect(()=>{
    setFiltredValues(possibleValues?.filter(p=>p.toLowerCase().trim().includes(search.toLowerCase().trim())))
  },[search,possibleValues])
    return (
    <Select 
                value={value}
                onValueChange={(e)=>{
                    setSearch("");
                    onValueChange(e)
                }}
              >
                
                <div className='flex w-full max-w-full gap-0'>

                <SelectTrigger className={"w-11/12 text-xs"}>
                  <SelectValue  placeholder={`Sélectionner un(e) ${label}`} />
                  
                </SelectTrigger>
               {value&& <button onClick={()=>onValueChange("")} className='w-1/12'>
                  <X className='text-red-500 hover:scale-150'/>
                </button>}
                </div>
                
                
                <SelectContent  id={`select-${name}`} className="bg-background-base ">
                  
                 

                
                  <div className='relative flex items-center gap-1 justify-center'>
                      <Input parentClassName='w-full mx-1' inputClassName='text-xs' type='text' label='' labelClassName='hidden' onChange={(e)=>{setSearch(e.target.value)}  } value={search} placeHolder={`search a ${name}`} />
                      <HiXMark onClick={()=>setSearch("")} className='absolute right-2 text-red-500 hover:font-bold cursor-pointer hover:w-5 hover:h-5'/>
                  </div>
                  { filtredValues?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
  );
};

export default SelectWithSearch;