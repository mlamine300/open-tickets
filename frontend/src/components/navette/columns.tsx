

import type{ ColumnDef } from "@tanstack/react-table"


import { format, formatDate } from 'date-fns'

import type { Navette } from "@/types";
import { ArrowDown,  Image, Pen } from "lucide-react";
import { fr } from "date-fns/locale";
import { Link } from "react-router";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns:(setSelectedNavette:(x:Navette)=>any)=> ColumnDef<Navette>[] =(setSelectedNavette)=> [
 
  {accessorKey:"date",
   header: () => {
      return (
       <p className="text-xs">Créé le (la date de l'action)</p>
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
    header:()=> <p className="text-xs">Date de Navette (date saisie par l'agent)</p>,
     cell: ({ row }) => {
       const arrival=row.original.arrivalTime
       const départure=row.original.departureTime
   
      return <div className="flex flex-col justify-center items-center gap-2"> 

        <p className="font-semibold text-xs">{`arrivé : ${formatDate(arrival,"eeee d MMMM HH:mm",{locale:fr})}`} </p>
        <ArrowDown className="text-primary"/>
        <p className="font-semibold text-xs">{`départ : ${formatDate(départure,"eeee d MMMM HH:mm",{locale:fr})}`} </p>
        </div>
        
      
     }
  },
 
{
    accessorKey: "comment",
    header: "Commentaire",
     cell: ({ row }) => {
       const comment=row.original.comment||"..."
   
      return <div className="flex flex-col gap-1 items-start ">
        <p className="font-semibold text-xs overflow-hidden">{comment} </p>
        
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
  {
    
    header: "edit",
     cell: ({ row }) => {
        
        const navette=row.original;
       
       
       
      
      return(
     <Pen className="hover:scale-110" onClick={()=>setSelectedNavette(navette)} />
      );
     }
  },
  
]