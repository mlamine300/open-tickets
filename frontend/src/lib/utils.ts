
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import type { ticket } from "@/types";
declare module 'file-saver';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportNotCompletReport = async (tickets:ticket[]) => {
    // Create a new workbook and worksheet
    
    const pending=tickets.filter(t=>t.status==="pending");
    const open=tickets.filter(t=>t.status!=="pending");
    const workbook = new ExcelJS .Workbook();
    const pendingSheet = workbook.addWorksheet('Pending');

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

      // Add data rows
      pending.forEach(line => {
        const creator=`${line.creator?.name} (${line.creator?.email})`;
        const emitterOrganization=line.emitterOrganization?.name;
        const recipientOrganization=line.recipientOrganization?.name;
        const ref=line.ref;
        const formname=line.formName;
        const status=line.status;
        const priority=line.priority;
        const message=line.message;
        const createdAt=line.createdAt;
        const lastComment=line.lastComment?.message;
        const row={creator,emitterOrganization,recipientOrganization,ref,formname,
          status,
          priority,
          message,
          createdAt,
          lastComment
        };
        pendingSheet.addRow(row)

      });
    }

     const openSheet = workbook.addWorksheet('Open');

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
      open.forEach(line => {
         const createdAt=line.createdAt;
        const creator=`${line.creator?.name} (${line.creator?.email})`;
        const assignedTo=`${line.assignedTo?.user.name} (${line.assignedTo?.user.email})`; 
        const emitterOrganization=line.emitterOrganization?.name;
        const recipientOrganization=line.recipientOrganization?.name;
        const ref=line.ref;
        const formname=line.formName;
        const status=line.status;
        const priority=line.priority;
        const message=line.message;
        const lastComment=line.lastComment?.message;
        const row={createdAt,creator,assignedTo,emitterOrganization,recipientOrganization,ref,formname,
          status,
          priority,
          message,
         
          lastComment
        };
        openSheet.addRow(row)

      })
    }

    // Generate Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and save the file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${new Date().toISOString()}-NotCompletReport.xlsx`);
  };