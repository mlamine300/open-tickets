import { zodResolver } from "@hookform/resolvers/zod";

import type { FormType, Organisation } from "../../../types";
import type z from "zod";

import Input from "./ui/Input";
import Button from "./ui/Button";

import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import toast from "react-hot-toast";
//import { useNavigate } from "react-router";
import { getAllorganisations } from "@/actions/action";
import { useEffect, useState } from "react";
import { addTicket } from "@/actions/action";
import { useForm } from "react-hook-form";




export default function DynamicForm({ form, schema }:{form:FormType|null,schema:any}) {

 // const navigate=useNavigate();
  const[allOrganisations,setAllORganisations]=useState<string[]>([]);
  const [pending,setPending]=useState<boolean>(false);
  useEffect(()=>{
    const getOrganisations=async()=>{
      const organisations=await getAllorganisations() as Organisation[];
      setAllORganisations(organisations.map(o=>o.name));
    }
    getOrganisations();
  },[])
  const myForm = useForm({
    resolver: zodResolver(schema),
  });
  const { errors } = myForm.formState;
const onSubmit = async(data: z.infer<typeof schema>) => {
  setPending(true)
    
  const ticket=await addTicket({formName:form?.name,...data});
  if(ticket){
toast.success("ticket créé!!!!")
myForm.reset();
setPending(false);
  //navigate("/form")
  }
  
  

}
if (!form) return <p>Form is null </p>;
  return (
      <form
      onSubmit={myForm.handleSubmit(onSubmit)}
      className="space-y-6   w-full bg-background-base rounded-lg shadow-2xl p-4 flex flex-col items-center "
    >
      <div>
        <h2 className="text-2xl font-semibold text-primary">{form.name}</h2>
        {form.description && (
          <p className="text-muted-foreground italic">{form.description}</p>
        )}
      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 w-full">


      {form.fields.map((field) => {
        if (
          field.possibleValues &&
          field.possibleValues.length ===1 &&
          field.possibleValues.at(0) === "organisations" 
        ) {
          console.log("-------->",allOrganisations);
          
          field.possibleValues.push(...allOrganisations);
        }
        const fieldError = (errors as Record<string, any>)[field.name]?.message;

        return (
          <div key={field.name} className="space-y-2">
          
            {(field.type === "text"||field.type==="number"||field.type==="date") && (
              <Input
              parentClassName="bg-background-base flex flex-col items-start gap-0"
              labelClassName={"w-full flex text-xs italic "}
              containerClassName="w-full "
              type={field.type}
              value={myForm.watch(field.name) ?? ""}
                // {...myForm.register(field.name)}
                placeHolder={`please enter ${field.name}`}
                label={field.label}
                {...myForm.register(field.name)}
                onChange={(e:any)=>{
                 myForm.setValue(field.name,field.type==="number"?Number(e.target.value)||0:e.target.value||"")
               // myForm.setValue(field.name,e.target.value||"")
                myForm.register(field.name)
              }}
                key={field.name}
              />
            )}
            {field.type === "select" && (
              <div className={"bg-background-base flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-${field.name}`}>{field.label} </label>
              <Select 
                value={myForm.watch(field.name) ?? field.default??""}
                onValueChange={(value) => myForm.setValue(field.name, value)}
              >
                
                <SelectTrigger className={"w-full"}>
                  <SelectValue  placeholder={`Select a ${field.label}`} />
                  
                </SelectTrigger>
                
                
                <SelectContent  id={`select-${field.name}`} className="bg-background-base ">
                  
                 

                 
                  { field.possibleValues?.map((val) => (
                    <SelectItem className="cursor-pointer hover:bg-gray-hot" key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                  
                </SelectContent>
                
              </Select>
              </div>
            )}

            {/* VALIDATION ERROR */}
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );
      })}

      <div  className="flex items-center w-full justify-center lg:col-span-2">
        <Button disabled={pending} text="Submit" variant="primary" type="submit" className="px-4 min-w-36 disabled:bg-gray-cold/20">
        
      </Button>
      </div>
      </div>
    </form>
  );
}
