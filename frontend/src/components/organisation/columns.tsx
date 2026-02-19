

import type{ ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router";
import { ArrowUpDown, Pen, Trash2 } from "lucide-react";

import { format } from 'date-fns'
import type { Organisation } from "@/types";
import type { Dispatch, SetStateAction } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns:({setToDeleteId,setShowModal}:{setToDeleteId:Dispatch<SetStateAction<string | null>>,setShowModal:Dispatch<SetStateAction<boolean>>})=> ColumnDef<Organisation>[] =({setToDeleteId,setShowModal})=> [
  {accessorKey:"createdAt",
   header: ({ column }) => {
      return (
        <div
        className="flex gap-1 items-center mx-4 cursor-pointer hover:bg-gray-cold/20 py-px px-2 rounded hover:font-bold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <p>Créer le</p>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      )
    },
    cell:({row})=>{
      const date=row.getValue("createdAt") as string;
      if(date)
      return <p className="text-start px-4 italic font-light text-text-primary/60">
        {format(date,"dd/MM/yyyy")}
      </p>
    return ""
    }

  }
  ,
  
  
  {
    accessorKey: "organisation",
    header: "Organisation",
     cell: ({ row }) => {
       const organisation=row.original.name
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{organisation} </p>
        
      </div>
     }
  },
  {
    accessorKey: "address",
    header: "Addresse",
     cell: ({ row }) => {
       const organisation=row.original.address
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{organisation} </p>
        
      </div>
     }
  },
   {
    accessorKey: "wilaya",
    header: "Wilaya",
     cell: ({ row }) => {
       const wilaya=row.original.wilaya
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{wilaya} </p>
        
      </div>
     }
  },
 {
    accessorKey: "phone",
    header: "Phone",
     cell: ({ row }) => {
       const phone=row.original.phone
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{phone} </p>
        
      </div>
     }
  },

    {
    accessorKey: "id",
    header: "Id",
     cell: ({ row }) => {
        
        // const name=row.getValue("name") as string;
        const id=row.original._id;
        
       
      
      return <Link className="underline italix text-xs hover:text-amber-300 flex items-center justify-around" to={`/organisations/${id}`}>
        
        <Pen size={20}/>
        
      </Link>;
     }
  },
     
  
    {
    
    header: "Delete",
     cell: ({ row }) => {
        
        // const name=row.getValue("name") as string;
        const id=row.original._id;
        
       
      
      return(
       <button 
      onClick={()=>{
       if(id){
setShowModal(true);
         setToDeleteId(id);
       }
        
        
      }}
      className="underline text-red-700 italix text-xs hover:rotate-45 flex items-center justify-around" >
        
        <Trash2 size={20}/>
        
      </button>);
     }
  },
  
  
]