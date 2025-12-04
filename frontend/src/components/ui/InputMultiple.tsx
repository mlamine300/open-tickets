import { useState } from "react";
import Input from "./Input";
import { Plus } from "lucide-react";


const InputMultiple = ({value,onValueChange,label,placeholder,parentClassName,containerClassName,labelClassName,inputClassName}:{value:string[],onValueChange:(lst:string[])=>void,label:string,name:string,placeholder?:string,parentClassName:string;containerClassName:string;labelClassName:string;inputClassName:string}) => {
  const [inputText,setInputText]=useState("");
   const values=value||[];
    return (
    <div className="flex flex-col gap-2">
        <div className="flex gap-1 items-center relative">
      <Input {...{parentClassName,containerClassName,labelClassName,inputClassName}} type="text" value={inputText} onChange={(e)=>setInputText(e.target.value)}  label={label} placeHolder={placeholder||""} />
      <Plus onClick={()=>{
        

        onValueChange([...values,inputText] as string[]);
        setInputText("");
      }} className="absolute right-10 text-primary hover:font-bold rounded top-[40%] h-8 cursor-pointer"/>
    </div>
    <div className="flex flex-wrap gap-2">
{values&& values.map(v=>
    <p className="px-4 py-1 rounded bg-primary hover:bg-red-500/50"  onClick={()=>onValueChange(value.filter(c=>c!==v))}>
        {v}
    </p>
)}
    </div>
    </div>
  );
};

export default InputMultiple;