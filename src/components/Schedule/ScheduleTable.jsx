import { useState, useEffect, useMemo } from "react";
import { fetchScheduleAdmin, deleteSchedule } from "../../utils/Schedule";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";

export default function ScheduleTable({ onRefresh }) {
  const eventId = localStorage.getItem("eventId");
  const [scheduleData, setScheduleData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      console.log("Event Id in Schedule Table : ", eventId);
      const response = await fetchScheduleAdmin(eventId);
      console.log("Schedule Data:", response);

      if (response) {
        setScheduleData(response);

        // Extract column names from the first item
        if (response.length > 0) {
          // Get all keys from the first item
          const allKeys = Object.keys(response[0]);

          // Filter out any internal keys or keys you want to always exclude
          const filteredColumns = allKeys.filter(
            (key) => !["__v", "_id", "Created_AT", "Event_ID"].includes(key)
          );

          setColumns(filteredColumns);
        }
      } else {
        setError("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching schedule data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [eventId, onRefresh]);

  async function handleDelete(scheduleId) {
    toast.promise(
      deleteSchedule(eventId, scheduleId).then(() => fetchSchedules()),
      {
        loading: "Deleting schedule...",
        success: "Schedule deleted successfully!",
        error: "Failed to delete schedule.",
      }
    );
  }

  // Fuzzy search function
  const fuzzySearch = (item, term) => {
    if (!term || term === "") return true;

    // Convert search term to lowercase
    const searchLower = term.toLowerCase();

    // Check if any field contains the search term
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchLower);
    });
  };

  // Handle column sorting
  const handleSort = (column) => {
    // If clicking the same column, toggle direction
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // If clicking a new column, set it as sort column with ascending direction
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = scheduleData.filter((item) => fuzzySearch(item, searchTerm));

    // Apply sorting if a column is selected
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        // Handle different data types
        if (typeof valueA === "boolean" && typeof valueB === "boolean") {
          return sortDirection === "asc"
            ? valueA === valueB
              ? 0
              : valueA
              ? -1
              : 1
            : valueA === valueB
            ? 0
            : valueA
            ? 1
            : -1;
        }

        // Handle null/undefined values
        if (valueA === null || valueA === undefined)
          return sortDirection === "asc" ? 1 : -1;
        if (valueB === null || valueB === undefined)
          return sortDirection === "asc" ? -1 : 1;

        // String comparison (case insensitive)
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        // Number comparison
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      });
    }

    return filtered;
  }, [scheduleData, searchTerm, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Format column header
  const formatColumnHeader = (column) => {
    // Replace underscores with spaces and capitalize each word
    return column
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format cell content
  const formatCellContent = (key, value) => {
    // Handle date fields
    if (key.includes("Date") && value) {
      const date = new Date(value);
      return date.toLocaleDateString();
    }

    // Handle time fields
    if (key.includes("Time") && value) {
      return value;
    }

    // Default formatting for other values
    return String(value || "-");
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
          <div className="text-gray-600">Loading schedule data...</div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="bg-red-100 p-4 rounded-md max-w-md">
          <div className="text-red-700 font-medium">Error</div>
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  // Render empty state
  if (scheduleData.length === 0) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">No schedules available</div>
          <div className="text-sm">
            There are currently no schedule records to display.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Search and controls */}
      <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Event Schedule
        </h3>

        <div className="mt-3 sm:mt-0 sm:ml-4 flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search box */}
          <div className="relative shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              className="block w-full rounded-2xl border-0 py-1.5 pl-10 px-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6"
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>

          {/* Items per page dropdown */}
          <div className="flex items-center ml-0 sm:ml-3">
            <label
              htmlFor="items-per-page"
              className="mr-2 text-sm text-gray-700"
            >
              Show
            </label>
            <select
              id="items-per-page"
              name="items-per-page"
              className="rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-2 text-sm text-gray-700">entries</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1 font-bold text-gray-700">
                    <span>{formatColumnHeader(column)}</span>
                    {sortColumn === column && (
                      <span className="inline-block">
                        {sortDirection === "asc" ? "⬆️" : "⬇️"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item, itemIndex) => (
              <tr
                key={itemIndex}
                className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {columns.map((column) => (
                  <td
                    key={`${itemIndex}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                  >
                    {formatCellContent(column, item[column])}
                  </td>
                ))}
                <td className="px-6 py-4 space-x-6 whitespace-nowrap text-sm text-gray-800">
                  <button
                    onClick={() => handleDelete(item.ID)}
                    className="text-red-600 hover:text-red-800 font-medium"
                    title="Delete Schedule"
                  >
                    <TrashIcon
                      className="h-5 w-5 inline-block"
                      aria-hidden="true"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                  // Show all pages if 5 or fewer
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  // Show 1,2,3,4,5 for first 3 pages
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  // Show last 5 pages
                  pageNum = totalPages - 4 + i;
                } else {
                  // Show currentPage-2, currentPage-1, currentPage, currentPage+1, currentPage+2
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                      currentPage === pageNum
                        ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile pagination */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-indigo-600 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-indigo-600 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
