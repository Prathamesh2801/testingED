"use client";

import { useState, useEffect, useMemo } from "react";
import {
  deleteSpecificPoll,
  fetchAllPolls,
  updatePollStatus,
} from "../../utils/Poll";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  TrashIcon,
  PencilSquareIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function PollTable({ onRefresh, onEdit, onView }) {
  const eventId = localStorage.getItem("eventId");
  const [pollData, setPollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchPolls = async () => {
    try {
      setLoading(true);
      console.log("Event Id in Poll Table : ", eventId);
      const response = await fetchAllPolls(eventId);
      console.log("Poll Data:", response);

      if (response) {
        setPollData(response);
      } else {
        setError("Invalid data format received from API");
      }
    } catch (err) {
      console.error("Error fetching poll data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [eventId, onRefresh]);

  // Handle Live status toggle
  const handleLiveToggle = async (pollId, currentStatus) => {
    try {
      await updatePollStatus(
        eventId,
        pollId,
        currentStatus === "1" ? "0" : "1"
      );

      setPollData((prevData) =>
        prevData.map((poll) =>
          poll.Poll_ID === pollId
            ? { ...poll, Live: currentStatus === "1" ? "0" : "1" }
            : poll
        )
      );

      toast.success(
        `Poll ${
          currentStatus === "1" ? "deactivated" : "activated"
        } successfully!`
      );
    } catch (error) {
      toast.error("Failed to update poll status");
    }
  };

  // Handle actions
  const handleView = (pollId) => {
    console.log("View poll:", pollId);
    onView(pollId);
  };

  const handleEdit = (pollId) => {
    console.log("Edit poll:", pollId);
    onEdit(pollId);
  };

  async function handleDelete(pollId) {
    toast.promise(
      deleteSpecificPoll(eventId, pollId).then(() => fetchPolls()),
      {
        loading: "Deleting Poll...",
        success: "Poll deleted successfully!",
        error: "Failed to delete Poll.",
      }
    );
  }

  // Fuzzy search function
  const fuzzySearch = (item, term) => {
    if (!term || term === "") return true;

    const searchLower = term.toLowerCase();

    // Search in Question and Options
    const searchableFields = [
      item.Question,
      item.Option1,
      item.Option2,
      item.Option3,
      item.Option4,
    ];

    return searchableFields.some((value) => {
      if (value === null || value === undefined || value === "") return false;
      return String(value).toLowerCase().includes(searchLower);
    });
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = pollData.filter((item) => fuzzySearch(item, searchTerm));

    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let valueA = a[sortColumn];
        let valueB = b[sortColumn];

        // Handle Live status sorting (convert to number for proper sorting)
        if (sortColumn === "Live") {
          valueA = Number.parseInt(valueA) || 0;
          valueB = Number.parseInt(valueB) || 0;
          return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
        }

        // Handle empty/null values for options
        if (valueA === null || valueA === undefined || valueA === "")
          valueA = "";
        if (valueB === null || valueB === undefined || valueB === "")
          valueB = "";

        // String comparison (case insensitive)
        if (typeof valueA === "string" && typeof valueB === "string") {
          return sortDirection === "asc"
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }

        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      });
    }

    return filtered;
  }, [pollData, searchTerm, sortColumn, sortDirection]);

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
    setCurrentPage(1);
  };

  // Format option display
  const formatOption = (option) => {
    return option && option.trim() !== "" ? option : "-";
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 h-12 w-12 mb-4"></div>
          <div className="text-gray-600">Loading poll data...</div>
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
  if (pollData.length === 0) {
    return (
      <div className="min-h-[400px] flex justify-center items-center">
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">No polls available</div>
          <div className="text-sm">
            There are currently no poll records to display.
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
          Event Polls
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
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
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
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Question")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Question</span>
                  {sortColumn === "Question" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Option1")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Option 1</span>
                  {sortColumn === "Option1" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Option2")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Option 2</span>
                  {sortColumn === "Option2" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Option3")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Option 3</span>
                  {sortColumn === "Option3" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Option4")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Option 4</span>
                  {sortColumn === "Option4" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("Live")}
              >
                <div className="flex items-center space-x-1 font-bold text-gray-700">
                  <span>Status</span>
                  {sortColumn === "Live" && (
                    <span className="inline-block">
                      {sortDirection === "asc" ? "⬆️" : "⬇️"}
                    </span>
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((poll, itemIndex) => (
              <tr
                key={poll.Poll_ID}
                className={itemIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 text-sm text-gray-800 max-w-xs">
                  <div className="truncate" title={poll.Question}>
                    {poll.Question}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatOption(poll.Option1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatOption(poll.Option2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatOption(poll.Option3)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {formatOption(poll.Option4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <button
                    onClick={() => handleLiveToggle(poll.Poll_ID, poll.Live)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                      poll.Live === "1" ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        poll.Live === "1" ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleView(poll.Poll_ID)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      title="View Poll"
                    >
                      <EyeIcon
                        className="h-5 w-5 inline-block"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => handleEdit(poll.Poll_ID)}
                      className="text-green-600 hover:text-green-800 font-medium"
                      title="Edit Poll"
                    >
                      <PencilSquareIcon
                        className="h-5 w-5 inline-block"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(poll.Poll_ID)}
                      className="text-red-600 hover:text-red-800 font-medium"
                      title="Delete Poll"
                    >
                      <TrashIcon
                        className="h-5 w-5 inline-block"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
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
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
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
