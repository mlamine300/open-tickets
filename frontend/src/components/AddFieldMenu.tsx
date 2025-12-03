import React, { useState } from 'react';
import type { FormFieldType } from '../../../types';
import {z} from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import Input from './ui/Input';
import SelectWithSearch from './SelectWithSearch';
import InputMultiple from './InputMultiple';
const AddFieldMenu = ({addFunction}:{addFunction:(data:FormFieldType)=>void}) => {
    const [field,setField]=useState<FormFieldType|null>()
     type placeholder={placeholder:string};
    const addFieldMenuFormFields:(FormFieldType&placeholder)[]=[
        {name:"name",type:"text",label:"Nom de formulaire",placeholder:"exemple: nom de client",required:true},
          {name:"label",type:"text",label:"label in database",placeholder:"exemple : name",required:true},
        {name:"type",type:"select",label:"type de champs",placeholder:"exemple : text ou number",required:true,possibleValues:["text","number","select","date","select-multiple","area","select-filter"]},
        {name:"possibleValues",type:"list",label:"Nom de formulaire",placeholder:"exemple: nom de client",required:false},
        {name:"default",type:"text",label:"valeur par default",placeholder:"dans le cas d'un champs select, selectionner la valeur par default",required:false},
        {name:"required",type:"select",label:"champs obligatoire ?",placeholder:"",possibleValues:["Oui","Non"] ,required:true},
        
    ]

    const addFieldMenuSchema=z.object({
        name:z.string().min(3,"le nom de formulaire est trés court"),
        label:z.string().min(3,"la label de formulaire est trés court"),
        type:z.enum(["text","number","select","date","select-multiple","area","select-filter"]).default("text"),
        possibleValues:z.array(z.string()).optional(),
        default:z.string().optional(),
        required:z.boolean().default(false)

    });
     const addFieldMenuForm = useForm({
        resolver: zodResolver(addFieldMenuSchema),
      });
  return (
    <Form {...addFieldMenuForm}>

    <form onSubmit={addFieldMenuForm.handleSubmit(addFunction)} className="grid grid-cols-1 xl:grid-cols-2 gap-x-2 gap-y-1">
    {addFieldMenuFormFields.map(fi=>{

        return   <FormField
          control={addFieldMenuForm.control}
          name={fi.name as any}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{fi.label}</FormLabel> */}
              <FormControl>
              {(fi.type==="number"||fi.type==="text"||fi.type==="date"||fi.type==="area")&& 
               <Input value={addFieldMenuForm.watch(fi.name as any)} onChange={(e)=>addFieldMenuForm.setValue(fi.name as any,e.target.value)} parentClassName='gap-px items-start w-full' containerClassName='h-8 w-11/12 ml-2' inputClassName='text-xs' labelClassName='italic text-xs' label={fi.label} type={fi.type}  placeHolder={fi.placeholder} />}
                {/* {fi.type==="select"&&
                <SelectWithSearch label={fi.label} name={fi.name}  value={addFieldMenuForm.watch(fi.name as any)} onValueChange={(s)=>addFieldMenuForm.setValue(fi.name as any,s)}/>}
                {fi.type==="list"&&
                <InputMultiple  label={fi.label} name={fi.name}  value={addFieldMenuForm.watch(fi.name as any)} onValueChange={(s)=>addFieldMenuForm.setValue(fi.name as any,s)}/>} */}
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
    })}
    </form>
    </Form>
  );
};

export default AddFieldMenu;