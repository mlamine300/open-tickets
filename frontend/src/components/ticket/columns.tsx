

import type{ ColumnDef } from "@tanstack/react-table"
import type { ticket } from "../../../../types"
import { Link } from "react-router";
import { ArrowUpDown, ExternalLink, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import Button from "../ui/Button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const TRACKING_PREFIX=import.meta.env.VITE_TRACKING_PREFIX;

export const columns: ColumnDef<ticket>[] = [
  {
    accessorKey: "ref",
    header: "Ref / Tracking",
     cell: ({ row }) => {
        
        const tracking=row.getValue("ref") as string;
      
      return <Link className="underline italix text-xs hover:text-amber-300 flex items-center justify-around"  target="_blank" to={`${TRACKING_PREFIX}/${tracking}`}>
        {tracking||"none"}
        <ExternalLink size={20}/>
        
      </Link>;
     }
  },
  {
    accessorKey: "creator",
    header: "Created by",
     cell: ({ row }) => {
        
        const obj=row.getValue("creator");
      const name =obj? (obj as any).name as string:"no one"
      const email =obj? (obj as any).email as string:""
      return <div className="flex flex-col gap-1 items-center ">
        <p className="font-semibold text-xs">{name} </p>
        <p className="italic font-light text-xs">{email} </p>
      </div>;
     }
  },
  {
    accessorKey: "emitterOrganizationId",
    header: "from / to",
     cell: ({ row }) => {
        const original=row.original;
        
      const emitterOrganization = (original.emitterOrganization as any).name as string
      const recipientOrganization = original.recipientOrganization?(original.recipientOrganization as any).name as string :"not yet"
      return <div className="flex flex-col justify-around items-center gap-1 w-fit">
        <p className="font-semibold text-xs flex gap-1"><span className="text-gray-cold italic">from:</span> {emitterOrganization} </p>
        <ArrowUpDown/>
         <p className="font-semibold text-xs flex gap-1"><span className="text-gray-cold italic">to:</span> {recipientOrganization} </p>
      </div>;
     }
  },

  {
    accessorKey: "status",
    header: "Status",
    cell:({row})=>{
      const status=row.getValue("status") as string;
      const color=status==="pending"?"#f00":status==="open"?"#0f0":status==="close"?"#F4F754":"#eee"
      return <div>
        <p className="lg:flex justify-center hidden px-2 py-px rounded-full text-white text-xs" style={{backgroundColor:color}}>{status}
      </p>
      <p style={{backgroundColor:color}} className="rounded-full p-px flex w-2 h-2 lg:hidden"></p>
      </div>
        
    }
  },
  {
    accessorKey: "priority",
    header: "Priority",
     cell:({row})=>{
      const priority=row.getValue("priority") as string;
      const color=priority==="high"?"#f00":priority==="medium"?"#F4F754":priority==="low"?"#0f0":"#eee"
      return <div> <p style={{backgroundColor:color}} className="rounded-full p-px flex w-2 h-2 lg:hidden"></p> <p className="hidden lg:flex  justify-center w-full py-px rounded text-white text-xs" style={{backgroundColor:color}}>
        {priority}
      </p></div>
    }
  },
   {
    accessorKey: "assignedTo",
    header: "Assigned To",
     cell: ({ row }) => {
        
        const obj=row.original.assignedTo?.user;
        
      const assignedTo =obj? (obj as any).name:"no one" as string
      return assignedTo||"no one";
     },
    },
{
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original._id;
      
      
      const status=row.getValue("status");
      const assigned=row.getValue("assignedTo");
      
      return (
        <DropdownMenu >
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white ">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem className="hover:bg-gray-hot/50 cursor-pointer" >
            <Link to={`/ticket/${id}`}>Voir Ticket</Link>
            </DropdownMenuItem>
            {status==="pending"&&<DropdownMenuItem className="hover:bg-gray-hot/50 cursor-pointer">prendre en charge</DropdownMenuItem>}
                 <DropdownMenuItem className="hover:bg-gray-hot/50 cursor-pointer" >Ajouter un commentaire</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    
    }
  
  
]