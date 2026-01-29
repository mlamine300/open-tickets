

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import type { ticket } from "@/types"
import { useUserContext } from "@/context/user/userContext"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });
const {user}=useUserContext();
const userOrganisation=user?.organisation;
const role=user?.role;
  return (
    <div className="overflow-hidden rounded-md border flex items-center justify-center w-full  border-gray-hot">
      <Table className="bg-background-base border border-gray-hot">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="border border-gray-hot bg-gray-hot/50 text-primary" key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="text-xs lg:text-sm" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => 
            {
              const ticket=row.original as ticket;
              const emitterOrganization=ticket.emitterOrganization?._id;
              const receiptionORganisation=ticket.recipientOrganization?._id;
              const isConcernerd=role==="admin"||role==="supervisor"||userOrganisation===emitterOrganization||userOrganisation===receiptionORganisation;
              return (
              <TableRow
              className={`border border-gray-hot cursor-pointer hover:bg-gray-hot/50 h-24 ${isConcernerd?" ":" bg-gray-hot/90 text-gray-400"}`}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
            }
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}