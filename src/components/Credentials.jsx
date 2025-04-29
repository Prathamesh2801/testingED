"use client"

import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import { ChevronDownIcon, ChevronUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { getAllCredentials } from '../utils/Credentials';

export default function Credentials() {
  // State for credentials data
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total_pages: 1
  });

  // Global filter state
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch credentials data
  const fetchCredentials = async () => {
    setLoading(true);
    try {
      const data = await getAllCredentials();
      setCredentials(data);
      console.log("Fetched credentials:", data);

      // Calculate total pages
      const totalPages = Math.ceil(data.length / pagination.limit);
      setPagination(prev => ({
        ...prev,
        total_pages: totalPages || 1
      }));

      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch credentials");
      console.error("Error fetching credentials:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCredentials();
  }, []);

  // Handle deleting a credential
  const handleDeleteCredential = async (credentialId) => {
    try {
      // Implement the delete API call here similar to deleteEvent
      // await deleteCredential(credentialId);

      // For now, just simulate deletion from the local state
      setCredentials(credentials.filter(cred => cred.id !== credentialId));

      toast.success("Credential deleted successfully", {
        duration: 2000,
      });

      // Refresh the page if needed
      handlePageChange(1, pagination.limit);
    } catch (error) {
      console.error("Error deleting credential:", error);
      toast.error(error.message || "An error occurred while deleting the credential");
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page: page,
      limit: pageSize || prev.limit
    }));
  };

  // Custom fuzzy filter using match-sorter-utils
  const fuzzyFilterFn = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed;
  };

  // Define columns
  const columns = useMemo(
    () => [
      {
        header: "Username",
        accessorKey: "Username",
      },
      {
        header: "Role",
        accessorKey: "role",
      },
      {
        header: "Event ID",
        accessorKey: "Event_ID",
        cell: (info) => info.getValue() || "N/A",
      },
      {
        header: "Actions",
        accessorKey: "id",
        cell: (info) => (
          <div className="flex space-x-6">
            <button
              onClick={() => handleDeleteCredential(info.row.original.id)}
              className="text-red-600 hover:text-red-900"
            >
              <TrashIcon className="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Create table instance
  const table = useReactTable({
    data: credentials,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    filterFns: { fuzzy: fuzzyFilterFn },
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    enableColumnFilters: false,
    manualPagination: false, // Using client-side pagination for this example
  });


  // Calculate page count
  useEffect(() => {
    if (credentials.length > 0) {
      const totalPages = Math.ceil(credentials.length / pagination.limit);
      setPagination(prev => ({
        ...prev,
        total_pages: totalPages
      }));
    }
  }, [credentials, pagination.limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading credentials</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!credentials || credentials.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No credentials found</h3>
        <p className="mt-1 text-sm text-gray-500">Create new credentials to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        <div className="flex items-center gap-4">
          <div>
            <span className="mr-2">
              Page {pagination.page} of {pagination.total_pages}
            </span>
            <select
              value={pagination.limit}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                handlePageChange(1, newSize);
              }}
              className="border bg-white px-2 py-1 rounded"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search Credentials..."
          className="border px-6 py-2 rounded-2xl w-1/4 bg-white text-gray-900"
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-6 text-left font-medium text-md text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ChevronUpIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-2 size-5 self-center justify-self-end text-gray-500 sm:size-6"
                      />, desc: <ChevronDownIcon
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 ml-2 size-5 self-center justify-self-end text-gray-500 sm:size-6"
                      />
                    }[header.column.getIsSorted()] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination buttons at the bottom */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-3 py-1 border rounded bg-white disabled:opacity-70 text-black font-semibold hover:bg-emerald-900 hover:text-white"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Showing page {pagination.page} of {pagination.total_pages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.total_pages}
          className="px-3 py-1 border bg-white rounded disabled:opacity-70 text-black font-semibold hover:bg-emerald-900 hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
}