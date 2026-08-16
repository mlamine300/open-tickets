

import type{ ColumnDef } from "@tanstack/react-table"


import { format, formatDate } from 'date-fns'

import type { Navette } from "@/types";
import { ArrowLeftRight, Image } from "lucide-react";
import { fr } from "date-fns/locale";
import { Link } from "react-router";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns:()=> ColumnDef<Navette>[] =()=> [
 
  {accessorKey:"date",
   header: () => {
      return (
       <p>Date</p>
      )
    },
    cell:({row})=>{

      const date=row.original.arrivalTime;
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
       const organisation=row.original.organisationName
       const author=row.original.authorName;
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-sm">{organisation} </p>
        <p className="font-semibold text-xs italic">{author} </p>
      </div>
     }
  },

  {
    accessorKey: "navetteRef",
    header: "Navette/Chauffeur",
     cell: ({ row }) => {
       const navette=row.original.navetteRef||"..."
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs">{navette} </p>
        
      </div>
     }
  },
   {
    accessorKey: "time",
    header: "Temps",
     cell: ({ row }) => {
       const arrival=row.original.arrivalTime
       const départure=row.original.departureTime
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-sm">{formatDate(arrival, 'eeee d MMMM', { locale: fr })} </p>
        <div className="flex justify-center items-center gap-2">

        <p className="font-semibold text-xs">{`arrivé : ${formatDate(arrival,"HH:mm")}`} </p>
        <ArrowLeftRight className="text-primary"/>
        <p className="font-semibold text-xs">{`départ : ${formatDate(départure,"HH:mm")}`} </p>
        </div>
        
      </div>
     }
  },
 


     
  
    {
    
    header: "attachement",
     cell: ({ row }) => {
        
        const att=row.original.attachement;
       
        if(!att)return "";
       
      
      return(
     <Link to={row.original.attachement+""||"/"} target="_blank" >
        <Image 
      
      className=" hover:rotate-45  active:scale-125" >  
      </Image>
      </Link>
      );
     }
  },
  
  
]