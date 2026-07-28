import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { TxsBag } from "@/client"; // Your types file
import { transactionColumns} from "@/components/Admin/txsColumns";
// The columns we made
import {TransactionDrawer} from "@/components/ui/tableDrawer"
import { useState } from 'react';

import { Transaction} from "@/client"

interface TransactionTableProps {
  dataBag: TxsBag ;
}

export function TransactionTable({ dataBag }: TransactionTableProps): React.JSX.Element {
  // 1. Initialize the table instance
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<Transaction | null>(null);
  const table = useReactTable({
    data: dataBag.txs, // Passing the array from TxsBag
    columns: transactionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
    pagination: {
      pageSize: 5, // <-- This forces the table to start with 10 rows
    },
  }, // Required for basic row rendering
  });


  // 2. Render the HTML table using TanStack's utilities
  return (
    <div>
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Georgia, serif', fontSize: '15px' }}>
        
        {/* HEADER SECTION */}
        <thead className="bg-slate-900 text-white">
        {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ padding: '12px 16px', fontWeight: '700', color: '#d7d7d9' }}>
                {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext())}
                </th>))}
            </tr>))}
        </thead>
        <tbody>
        {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
            <tr 
                key={row.id} 
                style={{ borderBottom: '1px solid #edf2f7' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                onClick={()=>{
                setSelectedRowData(row.original);
                requestAnimationFrame(() => {
                setIsDrawerOpen(true);})}}>
                {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ padding: '12px 16px', color: '#475569' }}>
                    {/* flexRender handles strings, numbers, or custom JSX cells smoothly */}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                ))}
            </tr>
            ))) : (
            <tr>
                <td colSpan={transactionColumns.length} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                No transactions found.
                </td>
            </tr>)}
        </tbody>
        </table>
    </div>
    <div className="flex items-center justify-between px-2 py-1 text-sm text-slate-600 ">
        <div className="flex items-center gap-2">
        <span>
            Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
            <strong>{table.getPageCount()}</strong>
        </span>
        <span className="text-slate-300">|</span>
        </div>
        <div className="flex items-center gap-2">
            <button
            className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}>
            {"<<"}
            </button>
            <button
            className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previous
            </button>
            <button
            className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Next
            </button>
            <button
            className="rounded border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}>
            {">>"}
            </button>
        </div>
    </div>
    <div>
    <TransactionDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} data={selectedRowData} />
    </div>
    </div>
    );
}









