import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

export default function DisplayEvents({ events = [], loading, error }) {
  const columns = useMemo(() => [
    {
      header: 'Event Name',
      accessorKey: 'Event_Name',
      cell: info => (
        <div className="flex items-center">
          <div className="h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={`https://via.placeholder.com/40`} // Replace with real logo if needed
              alt={info.row.original.Event_Name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{info.row.original.Event_Name}</div>
            <div className="text-sm text-gray-500">{info.row.original.Event_ID}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Status',
      accessorFn: row => {
        const now = new Date();
        const start = new Date(row.Event_Start_Date);
        const end = new Date(row.Event_End_Date);
        return now >= start && now <= end ? 'Live' : 'Inactive';
      },
      cell: info => (
        <span
          className={info.getValue() === 'Live'
            ? 'text-green-700 font-medium'
            : 'text-red-700 font-medium'}
        >
          {info.getValue()}
        </span>
      )
    },
    {
      header: 'Start Date',
      accessorKey: 'Event_Start_Date',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    },
    {
      header: 'End Date',
      accessorKey: 'Event_End_Date',
      cell: info => new Date(info.getValue()).toLocaleDateString()
    },
    {
      header: 'Features',
      accessorFn: row => row,
      cell: info => (
        <div className="flex space-x-2">
          {info.row.original.IsQRCode === '1' && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              QR
            </span>
          )}
          {info.row.original.IsFaceRec === '1' && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
              Face
            </span>
          )}
          {info.row.original.IsEmail === '1' && (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
              Email
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Actions',
      accessorKey: 'Event_ID',
      cell: info => (
        <button
          onClick={() => alert(`Navigate to Event ID: ${info.getValue()}`)}
          className="text-indigo-600 hover:text-indigo-900"
        >
          View
        </button>
      )
    }
  ], []);

  const [globalFilter, setGlobalFilter] = useState('');

  const fuzzyFilterFn = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed;
  };

  const table = useReactTable({
    data: events,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: { fuzzy: fuzzyFilterFn },
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    enableColumnFilters: false
  });

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
        <p className="mt-2 text-gray-500">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 text-red-500 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <input
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search Events..."
          className="border px-3 py-2 rounded shadow"
        />
        <div>
          <span className="mr-2">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: ' 🔼', desc: ' 🔽' }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
