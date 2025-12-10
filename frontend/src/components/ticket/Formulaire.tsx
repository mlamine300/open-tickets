import { zodResolver } from "@hookform/resolvers/zod";

import type { FormType, Organisation } from "@/types";
import type z from "zod";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import toast from "react-hot-toast";
//import { useNavigate } from "react-router";
import { getAllorganisationsAction } from "@/actions/organisationAction";
import { useEffect, useState } from "react";
import { addTicketAction } from "@/actions/ticketAction";
import { useForm } from "react-hook-form";
import SelectWithSearch from "../ui/SelectWithSearch";
import SelectMultiple from "../ui/SelectMultiple";
import { standardForm, StandartFierlds } from "@/data/data";
import Spinner from "../main/Spinner";
import { buildZodFormSchema } from "@/utils/zod";




export default function DynamicForm({ form,disabled }:{form:FormType|null,disabled?:boolean}) {
  const [triggerRerender,setTriggerRerender]=useState(0);
  //const [formulaire,setFormulaire]=useState<FormType>(form||standardForm());
  const formulaire=form||standardForm();
  
  
  
  const [pending,setPending]=useState<boolean>(false);
  useEffect(()=>{
    
    const getOrganisations=async()=>{
      const organisations=await getAllorganisationsAction() as Organisation[];
       //setAllORganisations(organisations); 
        const organisationString=organisations.map(o=>o.name);
      formulaire.fields.forEach(field=>{
        
        if(field.possibleValues&&Array.isArray(field.possibleValues)&&field.possibleValues.length>0&&field.possibleValues.at(0)==="organisations"){
        
          field.possibleValues=(organisationString)
          setTriggerRerender(Math.random());
        }
      })
    }
    if(!formulaire.fields.map(f=>f.name).includes("priority") )
     formulaire.fields.push(...StandartFierlds());
    getOrganisations();
  },[form])
 if(!formulaire){
return (<div className="flex justify-center items-center">
  <Spinner size="xl" />
 </div>)
 }
 
    

    //console.log(formulaire);
    
    if (!formulaire) return <p>Form is null </p>;
    const schema=buildZodFormSchema(formulaire) as any;
  const myForm = useForm({
    resolver: zodResolver(schema),
  });
  const { errors } = myForm.formState;
const onSubmit = async(data: z.infer<typeof schema>) => {
  setPending(true)
    console.log(data);
    
  const ticket=await addTicketAction({formName:formulaire?.name,...data});
  if(ticket){
toast.success("ticket créé!!!!")
myForm.reset();
setPending(false);
  //navigate("/form")
  }
  
  

}




  return (
      <form
      onSubmit={myForm.handleSubmit(onSubmit)}
      className="space-y-6   w-full bg-background-base rounded-lg shadow-2xl p-4 flex flex-col items-center "
    >
      <div>
        <h2 className="text-2xl font-semibold text-primary">{formulaire.name}</h2>
        {formulaire.description && (
          <p className="text-muted-foreground italic">{formulaire.description}</p>
        )}
      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 w-full">


      {formulaire.fields.map((field) => {
       
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
            {field.type === "select-filter" && (
              <div className={"bg-background-base flex flex-col items-start gap-0"}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-${field.name}`}>{field.label} </label>
             <SelectWithSearch 
             name={field.name}
               value={myForm.watch(field.name) ?? field.default??""} label={field.label} possibleValues={field.possibleValues} onValueChange={(value) => myForm.setValue(field.name, value)} />
              </div>
            )}
 {field.type === "select-multiple" && (
              <div className={"bg-background-base flex flex-col items-start gap-0 "}>
                <label className={'w-full flex text-xs italic '} htmlFor={`select-${field.name}`}>{field.label} </label>
             <SelectMultiple 
             name={field.name}
               value={myForm.watch(field.name) ?? field.default??[]} label={field.label} possibleValues={field.possibleValues} onValueChange={(value) => myForm.setValue(field.name, value)} />
              </div>
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
        <Button disabled={pending||disabled} text="Submit" variant="primary" type="submit" className="px-4 min-w-36 disabled:bg-gray-cold/20">
        
      </Button>
      </div>
      </div>
    </form>
  );
}
