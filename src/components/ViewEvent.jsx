import React, { useEffect, useState } from "react";
import { API_BASE_URL, NETWORK_ADDRESS } from "../config";
import { getEventById } from "../utils/EventFetchApi";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";

export default function ViewEvent({ viewEventId }) {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    const url = `${NETWORK_ADDRESS}/eventForm/${viewEventId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("URL copied to clipboard!", { duration: 2000 });
      setTimeout(() => setCopied(false), 2000); // reset after 2 sec
    });
  };
  useEffect(() => {
    async function fetchDetails() {
      try {
        const response = await getEventById(viewEventId);
        setEventDetails(response.Data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    }

    if (viewEventId) {
      fetchDetails();
    }
  }, [viewEventId]);

  if (loading) {
    return <p className="text-center py-4">Loading event details...</p>;
  }

  if (error) {
    return <p className="text-center py-4 text-red-600">{error}</p>;
  }

  if (!eventDetails) {
    return <p className="text-center py-4">No event found.</p>;
  }

  const {
    Event_Name,
    Event_Logo,
    Event_Start_Date,
    Event_End_Date,
    Event_WhatsApp_Template_ID,
    Event_WhatsApp_Column_Name,
    IsEmail,
    Event_Email_Column_Name,
    IsQRCode,
    IsFaceRec,
    IsQuiz,
    IsPoll,
    IsApp,
    Table_Structure,
  } = eventDetails;

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Event Details</h2>

      {/* Basic Info Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50 overflow-x-auto">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3  gap-4">
          <div className="flex flex-col  justify-around">
            <div>
              <p className="text-sm text-gray-500">Event Name</p>
              <p className="font-medium">{Event_Name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 ">Event Id</p>
              <p className="font-medium wrap-anywhere">{viewEventId}</p>
            </div>
          </div>

          {Event_Logo && (
            <div>
              <p className="text-sm text-gray-500">Event Logo</p>
              <img
                src={`${API_BASE_URL}/uploads/event_logos/${Event_Logo}`}
                alt="Event Logo"
                className="mt-1 h-24 w-24 object-contain rounded"
              />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">QrCode</p>
            <QRCodeCanvas
              value={`${NETWORK_ADDRESS}/eventForm/${viewEventId}`}
              size={120}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={true}
            />
            {copied && (
              <p className="text-green-600 text-sm font-medium mt-1">
                Link copied!
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row  md:col-span-2  justify-around  ">
            <div className="md:mr-60  ">
              <p className="text-sm text-gray-500 ">Start Date</p>
              <p className="font-medium">
                {new Date(Event_Start_Date).toLocaleDateString()}
              </p>
            </div>
            <div className="md:mr-60">
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium">
                {new Date(Event_End_Date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="mt-2 py-1 px-3 md:w-1/3 col-span-2 md:col-span-1  text-md font-semibold  outline-2 outline-emerald-700 text-emerald-700 rounded hover:bg-emerald-700  hover:outline-none hover:text-white transition duration-200 ease-in-out"
          >
            Copy URL
          </button>
        </div>
      </div>

      {/* Fields Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Event Fields</h3>
        {Table_Structure && Table_Structure.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Field Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Required
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Table_Structure.map((col, idx) => {
                  let displayType = col.Type;
                  let comment = col.Comment;

                  // Try to parse JSON comment if exists
                  let commentObj = {};
                  if (comment && comment.startsWith("{")) {
                    try {
                      commentObj = JSON.parse(comment);
                      if (commentObj.Type === "FILE") {
                        displayType = `FILE (${commentObj.AllowedTypes.join(
                          ", "
                        )})`;
                      }
                    } catch (e) {
                      // Use comment as is if parsing fails
                    }
                  }

                  return (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {col.Name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {displayType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {col.IsNull ? "No" : "Yes"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commentObj.Type === "FILE"
                          ? `Max size: ${(
                              commentObj.MaxSize /
                              (1024 * 1024)
                            ).toFixed(2)} MB`
                          : comment || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No fields available.</p>
        )}
      </div>

      {/* Communication Methods Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Communication Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">WhatsApp</p>
            <p className="font-medium">
              {Event_WhatsApp_Column_Name
                ? `Enabled (Field: ${Event_WhatsApp_Column_Name})`
                : "Disabled"}
            </p>
            {Event_WhatsApp_Template_ID && (
              <p className="text-sm text-gray-500">
                Template ID: {Event_WhatsApp_Template_ID}
              </p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">
              {IsEmail === "1"
                ? `Enabled (Field: ${
                    Event_Email_Column_Name || "Not specified"
                  })`
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">QR Code Registration</p>
            <p className="font-medium">
              {IsQRCode === "1" ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Face Registration</p>
            <p className="font-medium">
              {IsFaceRec === "1" ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quiz Feature</p>
            <p className="font-medium">
              {IsQuiz === "1" ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Polls Feature</p>
            <p className="font-medium">
              {IsPoll === "1" ? "Enabled" : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">App Feature</p>
            <p className="font-medium">
              {IsApp === "1" ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
