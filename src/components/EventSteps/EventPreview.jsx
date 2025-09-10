import { useState } from "react";
import { createEvent } from "../../utils/EventFetchApi";

export default function EventPreview({ formData, onSubmit, onPrevious }) {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Find the field marked as isUserID
    const userIDField = formData.fields.find((field) => field.isUserID);

    // Format fields to match required structure
    const formattedFields = formData.fields.map((field) => {
      const baseField = {
        Name: field.name,
        IsNull: !field.required,
        IsUnique: field.unique,
        IsUserID: field.isUserID || false, // Include isUserID field
      };

      switch (field.type) {
        case "varchar":
          return {
            ...baseField,
            Type: "VARCHAR",
            Length: parseInt(field.length) || 255,
          };
        case "int":
          return {
            ...baseField,
            Type: "BIGINT",
            Length: parseInt(field.length) || 11,
          };
        case "enum":
          return {
            ...baseField,
            Type: "ENUM",
            Options: field.enumValues,
          };
        case "file":
          return {
            ...baseField,
            Type: "FILE",
            AllowedTypes: field.allowedFileTypes || ["jpg", "jpeg", "png"],
            MaxSize: 5242880, // 5MB in bytes
            Path: `uploads/${field.name}`,
          };
        default:
          return baseField;
      }
    });

    // Create a formatted data object for the API
    const apiData = {
      basicInfo: formData.basicInfo,
      fields: formattedFields,
      communication: formData.communication,
      // Add the User ID field name if one exists
      userIDColumnName: userIDField ? userIDField.name : null,
    };

    console.log("API Data to be sent:", apiData);
    console.log("User ID Field:", userIDField?.name || "None selected");

    try {
      // Call the API function to create the event
      setLoading(true);
      const result = await createEvent(apiData);
      console.log("Event created successfully:", result);
      onSubmit();
    } catch (error) {
      alert("Error creating event: " + error.message);
      console.error("Event creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Event Preview</h2>

      {/* Basic Info Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Event Name</p>
            <p className="font-medium">{formData.basicInfo.eventName}</p>
          </div>
          {formData.basicInfo.eventLogo && (
            <div>
              <p className="text-sm text-gray-500">Event Logo</p>
              <p className="font-medium">{formData.basicInfo.eventLogo.name}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">{formData.basicInfo.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">{formData.basicInfo.endDate}</p>
          </div>
        </div>
      </div>

      {/* Fields Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Event Fields</h3>
        {formData.fields.length > 0 ? (
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
                    Unique
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.fields.map((field, index) => (
                  <tr
                    key={index}
                    className={field.isUserID ? "bg-blue-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {field.name}
                      {field.isUserID && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          User ID
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.type === "enum"
                        ? `ENUM (${field.enumValues.join(", ")})`
                        : field.type === "file"
                        ? `FILE (${
                            field.allowedFileTypes?.join(", ") ||
                            "jpg, jpeg, png"
                          })`
                        : `${field.type.toUpperCase()}${
                            field.length ? `(${field.length})` : ""
                          }`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`${
                          field.required ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {field.required ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`${
                          field.unique ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {field.unique ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.isUserID ? (
                        <span className="inline-flex items-center text-blue-600 font-medium">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Yes
                        </span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No fields added.</p>
        )}

        {/* User ID Field Summary */}
        {formData.fields.some((field) => field.isUserID) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-blue-800">
                User ID Field:{" "}
                <strong>
                  {formData.fields.find((field) => field.isUserID)?.name}
                </strong>
              </span>
            </div>
            <p className="text-xs text-blue-600 mt-1 ml-7">
              This field will be used for unique user identification and
              registration.
            </p>
          </div>
        )}
      </div>

      {/* Communication Methods Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Communication Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">WhatsApp</p>
            <p className="font-medium">
              {formData.communication.contactMethods.whatsapp
                ? `Enabled (Field: ${formData.communication.contactMethods.whatsappField})`
                : "Disabled"}
            </p>
            {formData.communication.contactMethods.whatsapp &&
              formData.communication.contactMethods.whatsappTemplateId && (
                <p className="text-sm text-gray-500">
                  Template ID:{" "}
                  {formData.communication.contactMethods.whatsappTemplateId}
                </p>
              )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">
              {formData.communication.contactMethods.email
                ? `Enabled (Field: ${formData.communication.contactMethods.emailField})`
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">QR Code Registration</p>
            <p className="font-medium">
              {formData.communication.contactMethods.qrCode
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Face Registration</p>
            <p className="font-medium">
              {formData.communication.contactMethods.faceRegistration
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quiz Feature</p>
            <p className="font-medium">
              {formData.communication.contactMethods.quiz
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Polls Feature</p>
            <p className="font-medium">
              {formData.communication.contactMethods.polls
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">App Feature</p>
            <p className="font-medium">
              {formData.communication.contactMethods.app
                ? "Enabled"
                : "Disabled"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
