import React, { useState } from 'react';
import type { FormFieldType } from '../../../../types';
import {z} from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import Input from '../ui/Input';
import SelectWithSearch from '../ui/SelectWithSearch';
import InputMultiple from '../ui/InputMultiple';
import Button from '../ui/Button';
const AddFieldMenu = ({addFunction}:{addFunction:(data:FormFieldType)=>void}) => {
    //const [field,setField]=useState<FormFieldType|null>()
     type placeholder={placeholder:string};
    const addFieldMenuFormFields:(FormFieldType&placeholder)[]=[
        {name:"name",type:"text",label:"Nom de champs",placeholder:"exemple: nom de client",required:true},
          {name:"label",type:"text",label:"label in database",placeholder:"exemple : name",required:true},
        {name:"type",type:"select",label:"type de champs",placeholder:"exemple : text ou number",required:true,possibleValues:["text","number","select","date","select-multiple","area","select-filter"]},
        {name:"possibleValues",type:"list",label:"valeur possibles",placeholder:"16-Alger",required:false},
        {name:"default",type:"text",label:"valeur par default",placeholder:"dans le cas d'un champs select, selectionner la valeur par default",required:false},
       // {name:"required",type:"select",label:"champs obligatoire ?",placeholder:"",possibleValues:["true","false"] ,required:true},
        
    ]

    const addFieldMenuSchema=z.object({
        name:z.string().min(3,"le nom de champs est trés court"),
        label:z.string().min(3,"la label de champs est trés court"),
        type:z.enum(["text","number","select","date","select-multiple","area","select-filter"]).default("text"),
        possibleValues:z.array(z.string()).optional().default([]),
        default:z.string().optional(),
        required:z.boolean().default(false)

    });
     const addFieldMenuForm = useForm({
        resolver: zodResolver(addFieldMenuSchema),
      });
  return (
    <Form {...addFieldMenuForm}>

    <form onSubmit={addFieldMenuForm.handleSubmit((data:FormFieldType)=>{
        addFunction(data)
        addFieldMenuForm.reset({name:"",label:"",type:"text",default:"",possibleValues:[],required:false});
        
    })} className="grid grid-cols-1 xl:grid-cols-2 gap-x-4 gap-y-2">
    {addFieldMenuFormFields.map(fi=>{

        return   <FormField
          control={addFieldMenuForm.control}
          name={fi.name as any}
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>{fi.label}</FormLabel> */}
              <FormControl>
              {(fi.type==="number"||fi.type==="text"||fi.type==="date"||fi.type==="area")?
               <Input value={addFieldMenuForm.watch(fi.name as any)} onChange={(e)=>addFieldMenuForm.setValue(fi.name as any,e.target.value)}
                parentClassName='gap-px items-start w-full' containerClassName='h-8 w-11/12 ml-2' inputClassName='text-xs' labelClassName='italic text-xs' label={fi.label} type={fi.type}  placeHolder={fi.placeholder} />
                :fi.type==="select"?
               <div className='flex flex-col gap-px items-start w-11/12'>
                <p className='italic text-xs'>{fi.label} </p>
                 <SelectWithSearch  label={fi.label} name={fi.name}  value={addFieldMenuForm.watch(fi.name as any||"")} onValueChange={(s)=>addFieldMenuForm.setValue(fi.name as any,fi.name==="required"?s==="oui":s)} possibleValues={fi.possibleValues}/>
               
               </div>
                :((fi.type)==="list")?
                <InputMultiple  label={fi.label} name={fi.name}  value={addFieldMenuForm.watch(fi.name as any)} onValueChange={(s:string[])=>addFieldMenuForm.setValue(fi.name as any,s)}
                 parentClassName='gap-px items-start w-full' containerClassName='h-8 w-11/12 ml-2' inputClassName='text-xs' labelClassName='italic text-xs'/>
             :""}
                </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
    })}
    <Button text='ajouter' variant='primary' className='xl:col-span-2 w-8/12 mx-auto mt-5 max-w-60' />
    </form>
    </Form>
  );
};

export default AddFieldMenu;