import { useState } from "react";
import Input from "./ui/Input";
import { Plus } from "lucide-react";


const InputMultiple = ({value,onValueChange,label,name,placeholder}:{value:string[],onValueChange:(lst:string[])=>void,label:string,name:string,placeholder?:string}) => {
  const [inputText,setInputText]=useState("");
    return (
    <div className="flex gap-1">
      <Input type="text" value={inputText} onChange={(e)=>setInputText(e.target.value)}  label={label} placeHolder={placeholder||""} />
      <Plus className="bg-primary text-background-base rounded w-8 h-4"/>
    </div>
  );
};

export default InputMultiple;