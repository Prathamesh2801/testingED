"use client"

import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import { rankItem } from "@tanstack/match-sorter-utils"
import { API_BASE_URL } from "../config"
import { deleteEvent, getEventById } from "../utils/EventFetchApi"
import {toast} from 'react-hot-toast'
import {TrashIcon,EyeIcon} from '@heroicons/react/24/outline'

export default function DisplayEvents({ events = [], loading, error, pagination, onPageChange ,onRefresh,onEventView}) {
  console.log("DisplayEvents received:", { events, loading, error, pagination }) // Debug log

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading events</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">Create a new event to get started.</p>
      </div>
    )
  }

  const handleDeleteEvent = async (eventId) => {

    try {
      await deleteEvent(eventId); // you don't need to check response.ok etc.
      // Refresh the events list
      if (onPageChange) {
        onRefresh()
        toast.success("Event deleted successfully",{
          duration: 2000,
        })
        onPageChange(1, pagination.limit); // Go to first page or you can reload current page
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(error.message || "An error occurred while deleting the event.");
    }
  };

  const handleEventView = async (eventId) => {
    if (typeof onEventView === 'function') {
      onEventView(eventId);
    }
  };


  const columns = useMemo(
    () => [
      {
        header: "Event Name",
        accessorKey: "Event_Name",
        cell: (info) => (
          <div className="flex items-center ">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img
                className="h-10 w-10 rounded-full"
                src={`${API_BASE_URL}/uploads/event_logos/${info.row.original.Event_Logo}`}
                alt={info.row.original.Event_Name}
              />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">{info.row.original.Event_Name}</div>
              <div className="text-sm text-gray-500">{info.row.original.Event_ID}</div>
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorFn: (row) => {
          const now = new Date()
          const start = new Date(row.Event_Start_Date)
          const end = new Date(row.Event_End_Date)
          return now >= start && now <= end ? "Active" : "Inactive"
        },
        cell: (info) => (
          <span className={info.getValue() === "Active" ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
            {info.getValue()}
          </span>
        ),
      },
      {
        header: "Start Date",
        accessorKey: "Event_Start_Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        header: "End Date",
        accessorKey: "Event_End_Date",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        header: "Features",
        accessorFn: (row) => row,
        cell: (info) => (
          <div className="flex space-x-2">
            {info.row.original.IsQRCode === "1" && (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                QR
              </span>
            )}
            {info.row.original.IsFaceRec === "1" && (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                Face
              </span>
            )}
            {info.row.original.IsEmail === "1" && (
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                Email
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Actions",
        accessorKey: "Event_ID",
        cell: (info) => (
          <div className="flex space-x-6">
            <button
              onClick={() => handleEventView(info.row.original.Event_ID)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              <EyeIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDeleteEvent(info.row.original.Event_ID)}
              className="text-red-600 hover:text-red-900"
            >
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ),
      },

    ],
    [],
  )

  const [globalFilter, setGlobalFilter] = useState("")

  const fuzzyFilterFn = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed
  }

  const table = useReactTable({
    data: events.events,
    columns,
    state: {
      globalFilter,
      pagination: pagination
        ? {
          pageIndex: pagination.page - 1,
          pageSize: pagination.limit,
        }
        : undefined,
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
    manualPagination: true,
    pageCount: pagination ? pagination.total_pages : undefined,
  })

  return (
    <div className="p-4 bg-gray-200 rounded-lg shadow-md">
      <div className="flex justify-between mb-6">
        
        <div className="flex items-center gap-4">
        
          <div>
            <span className="mr-2">
              Page {pagination?.page || 1} of {pagination?.total_pages || 1}
            </span>
            <select
              value={pagination?.limit || 10}
              onChange={(e) => {
                const newSize = Number(e.target.value)
                if (onPageChange) {
                  onPageChange(1, newSize)
                }
              }}
              className="border bg-white  px-2 py-1 rounded"
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
          placeholder="Search Events..."
          className="border px-6 py-2 rounded-3xl bg-white text-gray-900 "
        />
      </div>

      <table className="min-w-full divide-y divide-gray-200 rounded-2xl overflow-hidden">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-6 text-left  font-medium text-md text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " 🔼", desc: " 🔽" }[header.column.getIsSorted()] ?? null}
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
          onClick={() => onPageChange?.(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="px-3 py-1 border rounded bg-white  disabled:opacity-70 text-black font-semibold hover:bg-emerald-900 hover:text-white"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Showing page {pagination.page} of {pagination.total_pages}
        </span>
        <button
          onClick={() => onPageChange?.(pagination.page + 1)}
          disabled={pagination.page >= pagination.total_pages}
          className="px-3 py-1 border bg-white rounded disabled:opacity-70  text-black font-semibold hover:bg-emerald-900 hover:text-white"
        >
          Next
        </button>
      </div>
    </div>
  )
}
