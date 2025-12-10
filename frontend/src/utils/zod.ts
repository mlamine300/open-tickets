import { z } from "zod";
import type { FormType, FormFieldType } from "@/types";


export const  fieldToZod=(field:FormFieldType): z.ZodTypeAny=> {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
      schema = z.string();
      break;

    case "number":
      schema = z.number().refine(
        (val) => typeof Number(val) === "number" && !isNaN(val),
        { message: `${field.label} must be a number` }
      );
      break;

    case "date":
      schema = z.coerce.date(); // coercion from string → Date
      break;

    case "select":
      if (!field.possibleValues || field.possibleValues.length === 0) {
        schema = z.string(); // fallback
        
      }
      else if(field.possibleValues.length===1&&field.possibleValues.at(0)==="organisations"){
      schema = z.string();
      }
      else {
        schema = z.enum(field.possibleValues as [string, ...string[]]);
        if(field.default)schema=schema.default(field.default)
      }
      break;

    default:
      schema = z.any();
  }

  if (field.required) {
    return schema;
  }

  return schema.optional();
}

export  function buildZodFormSchema(formFromDb:FormType) {
   
  const shape: Record<string, z.ZodTypeAny> = {

  };

  formFromDb.fields.forEach((field) => {
    shape[field.name] = fieldToZod(field);
  });

  return z.object(shape);
}
