import { useState } from "react";
import SelectWithSearch from "./SelectWithSearch";


const SelectMultiple =({value,onValueChange,label,name,possibleValues}:{value:string[];onValueChange:(value:string[])=>void;label:string;name:string;possibleValues?:string[]}) => {
    const [selectValue,setSelectValue]=useState("");
   // const [selectedValues,setSelectedValues]=useState<string[]> ([]);
    
    
    return (
    <div className="flex flex-col gap-2 w-full">
        <SelectWithSearch value={selectValue} label={label} name={name} possibleValues={possibleValues} onValueChange={(v)=>{
           const lst=value.filter(s=>s===v);
            if(!lst||lst.length===0){
                //setSelectedValues(lst=>[...lst,v])
                onValueChange([...value,v]);
            }
            
            setSelectValue(v);
        }} />
        {value&& <div className="flex w-full gap-2 flex-wrap max-h-32 overflow-y-auto p-1 rounded bg-background-base">
            {value.map(v=>
                <p onClick={()=>{
                     onValueChange(value.filter(f=>f!==v));
                    //setSelectedValues(lst=>lst.filter(l=>l!==v)) 
                }} className="hover:bg-red-500/50 cursor-pointer rounded bg-primary/50 text-text-primary text-xs px-3 py-px italic shadow-lg">{v} </p>
            )}
        </div>}
    </div>
  );
};

export default SelectMultiple;