import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

export default function App() {
  // Dummy data
  const data = useMemo(
    () => [
      { username: 'Tiger Nixon', event: 'System Architect' },
      { username: 'Garrett Winters', event: 'Accountant' },
      { username: 'Ashton Cox', event: 'Junior Technical Author' },
      { username: 'Cedric Kelly', event: 'Senior Javascript Developer' },
      { username: 'Airi Satou', event: 'Accountant' },
      { username: 'Brielle Williamson', event: 'Integration Specialist' },
      { username: 'Herrod Chandler', event: 'Sales Assistant' },
      { username: 'Rhona Davidson', event: 'Integration Specialist' },
      { username: 'Colleen Hurst', event: 'Javascript Developer' },
      { username: 'Sonya Frost', event: 'Software Engineer' },
      { username: 'Jena Gaines', event: 'Office Manager' },
      { username: 'Quinn Flynn', event: 'Support Lead' },
      { username: 'Charde Marshall', event: 'Regional Director' },
      { username: 'Haley Kennedy', event: 'Senior Marketing Designer' },
      { username: 'Tatyana Fitzpatrick', event: 'Regional Director' },
      { username: 'Michael Silva', event: 'Marketing Designer' },
      { username: 'Paul Byrd', event: 'Chief Financial Officer (CFO)' },
      { username: 'Gloria Little', event: 'Systems Administrator' },
      { username: 'Bradley Greer', event: 'Software Engineer' },
      { username: 'Dai Rios', event: 'Personnel Lead' }
    ],
    []
  );

  // Column definitions
  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Username'
      },
      {
        accessorKey: 'event',
        header: 'Event'
      }
    ],
    []
  );

  // Global filter state
  const [globalFilter, setGlobalFilter] = useState('');

  // Custom fuzzy filter using match-sorter-utils
  const fuzzyFilterFn = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed;
  };

  // Create table instance
  const table = useReactTable({
    data,
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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          value={globalFilter}
          onChange={e => table.setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring"
        />
        <div>
          <span className="mr-2">
            Page{' '}
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
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
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{ asc: ' ⬆', desc: ' ⬇' }[header.column.getIsSorted()] ?? null}
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
