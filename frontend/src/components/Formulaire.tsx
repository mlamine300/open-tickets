// import React, { useEffect, useState } from 'react';
// import type { Form } from '../../../types';
// import { getAllorganisations } from '@/utils/helper';

// const Formulaire = ({form}:{form:Form|null}) => {
//   const[organisations,setOrganisations]=useState(null);
//   useEffect(()=>{
//     const setOrganisation=async()=>{
//       const theorganisations=await getAllorganisations();
//       setOrganisations(theorganisations)
//     }
//     setOrganisation();
//   },[])
//     console.log(form);
//     console.log(organisations);
    
//   return (
//     <div>
//       <h1>Form</h1>
//     </div>
//   );
// };

// export default Formulaire;

import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { FormType, FormFieldType } from "../../../types";
import type z from "zod";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export default function DynamicForm({ form, schema }:{form:FormType|null,schema:any}) {
  const myForm = useForm({
    resolver: zodResolver(schema),
  });
  const { errors } = myForm.formState;
const onSubmit = (data: z.infer<typeof schema>) => {
  console.log(data);
  

}
if (!form) return <p>Form is null </p>;
  return (
      <form
      onSubmit={myForm.handleSubmit(onSubmit)}
      className="space-y-6   w-full bg-white rounded-lg shadow-2xl p-4 flex flex-col items-center "
    >
      <div>
        <h2 className="text-2xl font-semibold text-primary">{form.name}</h2>
        {form.description && (
          <p className="text-muted-foreground italic">{form.description}</p>
        )}
      </div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-2 w-full">


      {form.fields.map((field) => {
        const fieldError = (errors as Record<string, any>)[field.name]?.message;

        return (
          <div key={field.name} className="space-y-2">
            <Label>{field.label}</Label>

            {/* TEXT FIELD */}
            {field.type === "text" && (
              <Input
              containerClassName="bg-white"
              type="text"
                {...myForm.register(field.name)}
                placeHolder={field.label}
                label={field.label}
              value={field.name}
              key={field.name}
              />
            )}

            {/* NUMBER FIELD */}
            {field.type === "number" && (
              <Input
              containerClassName="bg-white"
              label={field.label}
              value={field.name}
              key={field.name}
              
                type="number"
                {...myForm.register(field.name, { valueAsNumber: true })}
                placeHolder={field.label}
              />
            )}

            {/* DATE FIELD */}
            {field.type === "date" && (
              <Input
              containerClassName="bg-white"
              label={field.label}
              value={new Date().toDateString()}
              key={field.name}
              placeHolder={field.label}
                type="date"
                {...myForm.register(field.name)}
              />
            )}

            {/* SELECT FIELD */}
            {field.type === "select" && (
              <Select
              
                onValueChange={(value) => myForm.setValue(field.name, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select a ${field.label}`} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {field.possibleValues?.map((val) => (
                    <SelectItem key={val} value={val}>
                      {val}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* VALIDATION ERROR */}
            {fieldError && (
              <p className="text-sm text-red-500">{fieldError}</p>
            )}
          </div>
        );
      })}

      <Button text="Submit" variant="primary" type="submit" className="w-full">
        
      </Button>
      </div>
    </form>
  );
}
