import type { ticket } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
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
      const columns = Object.keys(pending[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
        key: key,
        width: 20 // Adjust width as needed
      }));
      pendingSheet.columns = columns;

      // Add data rows
      pending.forEach(row => pendingSheet.addRow(row));
    }

     const openSheet = workbook.addWorksheet('Open');

    // Extract columns from the first row of data 
    if (open.length > 0) {
      // Dynamically define columns based on the keys in the first data object
      const columns = Object.keys(open[0]).map(key => ({
        header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
        key: key,
        width: 20 // Adjust width as needed
      }));
      openSheet.columns = columns;

      // Add data rows
      open.forEach(row => openSheet.addRow(row));
    }

    // Generate Excel file as a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob from the buffer and save the file
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `${new Date().toISOString()}-NotCompletReport.xlsx`);
  };