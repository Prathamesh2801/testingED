// ClientSection.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ClientDataTable from "./ClientDataTable";
import CreateNewClientEvent from "./CreateNewClientEvent";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  DocumentArrowUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { fetchEvents } from "../utils/EventFetchApi";
import { getUserDataByClient } from "../utils/ClientData";
import { uploadEventExcel } from "../utils/ClientData";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";

export default function ClientSection() {
  const eventId = localStorage.getItem("eventId");
  const navigate = useNavigate();
  const location = useLocation();

  // Component state
  const [view, setView] = useState("display");
  const [userId, setUserId] = useState(null);
  const [fileConfig, setFileConfig] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFaceRecEnabled, setIsFaceRecEnabled] = useState(false);

  // Parse query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get("view");
    if (v === "create" || v === "display") setView(v);
    setUserId(params.get("userId"));
  }, [location.search]);

  // Fetch event field config
  useEffect(() => {
    const renderEvents = async () => {
      try {
        const response = await fetchEvents(eventId);
        const evt = response.Data.event;
        setIsFaceRecEnabled(evt.IsFaceRec === "1" || evt.IsFaceRec === 1);
        const eventData = response.Data.fields;
        const requiredFileField = eventData.find(
          (f) => f.isFile === true && f.required === true
        );
        setFileConfig(requiredFileField);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    renderEvents();
  }, [eventId]);

  // Prevent manually going to ?view=create when face-rec is on
  useEffect(() => {
    if (isFaceRecEnabled && view === "create") {
      setView("display");
      navigate({ search: "?view=display" });
    }
  }, [isFaceRecEnabled, view, navigate]);

  // Toggle display/create views
  const toggleView = () => {
    const next = view === "display" ? "create" : "display";
    setView(next);
    navigate(`?view=${next}`);
  };

  // Download existing registrations as Excel
  const handleDownload = async () => {
    try {
      const data = await getUserDataByClient(eventId);
      if (!Array.isArray(data) || data.length === 0) return;
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
      const filename = `Event_${eventId}_Registrations.xlsx`;
      XLSX.writeFile(workbook, filename);
    } catch (err) {
      console.error("Error downloading Excel:", err);
    }
  };

  // Open upload modal
  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
    setSelectedFile(null);
    setUploadError("");
  };

  // File change handler for upload modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    // Check if file is selected
    if (!file) {
      setUploadError("Please select a file");
      setSelectedFile(null);
      return;
    }

    // Check file type
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    if (!validTypes.includes(file.type)) {
      setUploadError("Please upload only Excel files (.xlsx, .xls, .csv)");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setUploadError("");
  };

  // Confirm upload and call API
  const handleConfirmUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file before confirming.");
      return;
    }

    try {
      console.log("File ready for upload:", selectedFile);
      console.log("Event ID:", eventId);
      await uploadEventExcel({ eventID: eventId, excelFile: selectedFile });
      toast.success("File uploaded successfully!", { duration: 3000 });
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadError("");

      setRefreshKey((prev) => prev + 1); // Trigger refresh
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadError("Upload failed. Please check file format and try again.");
    }
  };

  // Close modal handler
  const handleCloseModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setUploadError("");
  };

  // Upload Modal Component (merged into ClientSection)
  const UploadModal = () => {
    return (
      <Dialog
        open={isUploadModalOpen}
        onClose={handleCloseModal}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 pr-4 pt-4">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                  onClick={handleCloseModal}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <DocumentArrowUpIcon
                    className="h-6 w-6 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Upload User Data
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please upload an Excel file (.xlsx, .xls, .csv) containing
                      user data
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                  )}
                  {selectedFile && (
                    <p className="mt-2 text-sm text-green-600">
                      Selected file: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500  focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                  onClick={handleConfirmUpload}
                >
                  Upload
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    );
  };

  return (
    <div>
      <div className="border-b border-gray-200 pb-4 mb-6 flex flex-col md:flex-row gap-8 items-center">
        {!isFaceRecEnabled && (
          <button
            onClick={toggleView}
            className="inline-flex items-center rounded-2xl bg-gradient-to-br from-green-300 to-green-700 px-3 py-2 text-md font-semibold text-white shadow hover:bg-gradient-to-tl cursor-pointer"
          >
            {view === "display" ? "Add New User" : "Show Users"}
          </button>
        )}
        <div className="mx-auto md:ml-auto md:mx-0 flex items-center space-x-4">
          {!fileConfig && (
            <button
              onClick={handleUploadClick}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(121deg,_#92BDFF_31.23%,_#369DC9_108.38%)] rounded-[15px] cursor-pointer hover:bg-[linear-gradient(121deg,_#369DC9_31.23%,_#92BDFF_108.38%)]"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
              <span>Upload Data</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[linear-gradient(121deg,_#FF968F_16.01%,_#FF6D4C_108.38%)] rounded-[15px] cursor-pointer hover:bg-[linear-gradient(121deg,_#FF6D4C_16.01%,_#FF968F_108.38%)]"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            <span>Download Data</span>
          </button>
        </div>
      </div>

      {view === "display" ? (
        <ClientDataTable onRefresh={refreshKey} />
      ) : (
        <CreateNewClientEvent userId={userId} />
      )}

      {/* Render the Upload Modal */}
      <UploadModal />
    </div>
  );
}
