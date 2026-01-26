
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import type { ticket } from "@/types";
declare module 'file-saver';
import { differenceInDays } from 'date-fns';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportNotCompletReport = async (tickets:ticket[]) => {
    // Create a new workbook and worksheet
    
    const pending=tickets.filter(t=>t.status==="pending");
    const open=tickets.filter(t=>t.status!=="pending");
    const workbook = new ExcelJS .Workbook();
    const pendingSheet = workbook.addWorksheet('en attente');

    // Extract columns from the first row of data 
    if (pending.length > 0) {
      // Dynamically define columns based on the keys in the first data object
         const columns = [
       {
        header:"Date",
        key:"createdAt",
        width:20
      },
        {
        header:"NBR de jours",
        key:"delay",
        width:20
      },
        {
        header:"Créateur",
        key:"creator",
        width:20
      },
      {
        header:"Organisation Emmitrice",
        key:"emitterOrganization",
        width:20
      },
       {
        header:"Organisation Déstinatrice",
        key:"recipientOrganization",
        width:20
      },
        {
        header:"Référence/tracking",
        key:"ref",
        width:20
      },
        {
        header:"Type de Réclamation",
        key:"formname",
        width:20
      },
        {
        header:"Statut",
        key:"status",
        width:20
      },
        {
        header:"Urgence",
        key:"priority",
        width:20
      },
        {
        header:"Message",
        key:"message",
        width:20
      },
       {
        header:"Dernier Commentaire",
        key:"LastComment",
        width:60
      },
    ]
      pendingSheet.columns = columns;
      const pendingRows:any[]=[];
      // Add data rows
      pending.forEach(line => {
        const createdAt=line.createdAt;
        const delay=differenceInDays(new Date(),createdAt||new Date())
        const creator=`${line.creator?.name} (${line.creator?.email})`;
        const emitterOrganization=line.emitterOrganization?.name;
        const recipientOrganization=line.recipientOrganization?.name;
        const ref=line.ref;
        const formname=line.formName;
      const status=line.status==="pending"?"en attente":line.status==="open"?"ouvert":"NAN";
        const priority=line.priority==="low"?"Normal":line.priority==="medium"?"Urgent":"Trés Urgent";
        const message=line.message;
        
        const lastComment=line.lastComment?.message;
        const row={creator,delay,emitterOrganization,recipientOrganization,ref,formname,
          status,
          priority,
          message,
          createdAt,
          lastComment
        };
        //pendingSheet.addRow(row)
        pendingRows.push(row);
      });
      pendingRows.sort((r1,r2)=>(r2.delay-r1.delay))
      pendingSheet.addRows(pendingRows);
    }

     const openSheet = workbook.addWorksheet('ouvert');

    // Extract columns from the first row of data 
    if (open.length > 0) {
      // Dynamically define columns based on the keys in the first data object
      // const columns = Object.keys(open[0]).map(key => ({
      //   header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
      //   key: key,
      //   width: 20 // Adjust width as needed
      // }));
      const columns = [
       {
        header:"Date",
        key:"createdAt",
        width:20
      },
       {
        header:"NBR de jours",
        key:"delay",
        width:20
      },
        {
        header:"Créateur",
        key:"creator",
        width:20
      },
         {
        header:"Pris en charge Par",
        key:"assignedTo",
        width:40
      },
      {
        header:"Organisation Emmitrice",
        key:"emitterOrganization",
        width:20
      },
       {
        header:"Organisation Déstinatrice",
        key:"recipientOrganization",
        width:20
      },
        {
        header:"Référence/tracking",
        key:"ref",
        width:20
      },
        {
        header:"Type de Réclamation",
        key:"formname",
        width:20
      },
        {
        header:"Statut",
        key:"status",
        width:20
      },
        {
        header:"Urgence",
        key:"priority",
        width:20
      },
        {
        header:"Message",
        key:"message",
        width:20
      },
       {
        header:"Dernier Commentaire",
        key:"LastComment",
        width:60
      },
    ]
      openSheet.columns = columns;

      // Add data rows
      const openRows:any[]=[];
      open.forEach(line => {
         const createdAt=line.createdAt;
         const delay=differenceInDays(new Date(),createdAt||new Date())
        const creator=`${line.creator?.name} (${line.creator?.email})`;
        const assignedTo=`${line.assignedTo?.user.name} (${line.assignedTo?.user.email})`; 
        const emitterOrganization=line.emitterOrganization?.name;
        const recipientOrganization=line.recipientOrganization?.name;
        const ref=line.ref;
        const formname=line.formName;
        const status=line.status==="pending"?"en attente":line.status==="open"?"ouvert":"NAN";
        const priority=line.priority==="low"?"Normal":line.priority==="medium"?"Urgent":"Trés Urgent";
        const message=line.message;
        const lastComment=line.lastComment?.message;
        const row={createdAt,delay,creator,assignedTo,emitterOrganization,recipientOrganization,ref,formname,
          status,
          priority,
          message,
         
          lastComment
        };
        //openSheet.addRow(row)
    openRows.push(row);
      })
      openRows.sort((r1,r2)=>r2.delay-r1.delay)
      openSheet.addRows(openRows);
    }

    // Generate Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and save the file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${new Date().toISOString()}-NotCompletReport.xlsx`);
  };
  export const exportReport = async (tickets:ticket[]) => {
    // Create a new workbook and worksheet
    
  
    const workbook = new ExcelJS .Workbook();
    const Sheet = workbook.addWorksheet('Tickets');

    // Extract columns from the first row of data 
    if (tickets.length > 0) {
      // Dynamically define columns based on the keys in the first data object
         const columns = [
       {
        header:"Date",
        key:"createdAt",
        width:20
      },
        {
        header:"Créateur",
        key:"creator",
        width:20
      },
       {
        header:"Pris en charge Par",
        key:"assignedTo",
        width:40
      },
      {
        header:"Organisation Emmitrice",
        key:"emitterOrganization",
        width:20
      },
       {
        header:"Organisation Déstinatrice",
        key:"recipientOrganization",
        width:20
      },
        {
        header:"Référence/tracking",
        key:"ref",
        width:20
      },
        {
        header:"Type de Réclamation",
        key:"formname",
        width:20
      },
        {
        header:"Statut",
        key:"status",
        width:20
      },
        {
        header:"Urgence",
        key:"priority",
        width:20
      },
        {
        header:"Message",
        key:"message",
        width:20
      },
       {
        header:"Dernier Commentaire",
        key:"LastComment",
        width:60
      },
    ]
      Sheet.columns = columns;
      
      // Add data rows
      tickets.forEach(line => {
        const createdAt=line.createdAt;
        const creator=`${line.creator?.name} (${line.creator?.email})`;
         const assignedTo=line.assignedTo?.user.email?`${line.assignedTo?.user.name} (${line.assignedTo?.user.email})`:"";
        const emitterOrganization=line.emitterOrganization?.name;
        const recipientOrganization=line.recipientOrganization?.name;
        const ref=line.ref;
        const formname=line.formName;
      const status=line.status==="pending"?"en attente":line.status==="open"?"ouvert":"NAN";
        const priority=line.priority==="low"?"Normal":line.priority==="medium"?"Urgent":"Trés Urgent";
        const message=line.message;
        
        const lastComment=line.lastComment?.message;
        const row={creator,assignedTo,emitterOrganization,recipientOrganization,ref,formname,
          status,
          priority,
          message,
          createdAt,
          lastComment
        };
        Sheet.addRow(row)
       
      });
      
    }

   

   

    // Generate Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and save the file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${new Date().toISOString()}-Tickets Report.xlsx`);
  };