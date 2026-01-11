

import type{ ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router";
import { ArrowUpDown, Pen } from "lucide-react";

import { format } from 'date-fns'
import type { User } from "@/types";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns:()=> ColumnDef<User>[] =()=> [
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
    accessorKey: "user",
    header: "User",
     cell: ({ row }) => {
       const email=row.original.email;
       const name=row.original.name;
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{name} </p>
        <p className="italic font-light text-xs">{email} </p>
      </div>
     }
  },
  {
    accessorKey: "organisation",
    header: "Organisation",
     cell: ({ row }) => {
       const organisation=(row.original.organisation as any).name;
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{organisation} </p>
        
      </div>
     }
  },

  {
    accessorKey: "status",
    header: "Status",
    cell:({row})=>{
      const status=row.original.activeStatus;
      const color=status?"#0f0":"#f00";
      return  <div style={{backgroundColor:color}} className="rounded-full p-px flex justify-center ">
        <p className="text-xs px-2 py-px italic">{status?"Active":"Désactiver"} </p>
      </div>
     
        
    }
  },
 
  

       {
    accessorKey: "role",
    header: "Role",
     cell: ({ row }) => {
        
        const role=row.original.role;
        const bgColor=role==="supervisor"?"#333":"#D3AF37"  
        const txtColor=role==="supervisor"?"#eee":"#333"  
      
      return <p style={{
        backgroundColor:bgColor,
        color:txtColor
      }} className="text-xs rounded-full px-2 py-px">
        {role}
      </p>;
     },
    },
    {
    accessorKey: "id",
    header: "Id",
     cell: ({ row }) => {
        
        // const name=row.getValue("name") as string;
        const id=row.original._id;
        
       
      
      return <Link className="underline italix text-xs hover:text-amber-300 flex items-center justify-around"   to={`/users/${id}`}>
        
        <Pen size={20}/>
        
      </Link>;
     }
  },
     
  
  
]