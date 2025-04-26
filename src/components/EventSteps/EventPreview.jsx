import React from 'react'
import { createEvent } from '../../utils/EventFetchApi'; 

export default function EventPreview({ formData, onSubmit, onPrevious }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format fields to match required structure
    const formattedFields = formData.fields.map(field => {
      const baseField = {
        Name: field.name,
        IsNull: !field.required,
        IsUnique: field.unique
      };

      switch (field.type) {
        case 'varchar':
          return {
            ...baseField,
            Type: 'VARCHAR',
            Length: parseInt(field.length) || 255
          };
        case 'int':
          return {
            ...baseField,
            Type: 'BIGINT',
            Length: parseInt(field.length) || 11
          };
        case 'enum':
          return {
            ...baseField,
            Type: 'ENUM',
            Options: field.enumValues
          };
        case 'file':
          return {
            ...baseField,
            Type: 'FILE',
            AllowedTypes: field.allowedFileTypes || ['jpg', 'jpeg', 'png'],
            MaxSize: 5242880, // 5MB in bytes
            Path: 'uploads/profile_pictures'
          };
        default:
          return baseField;
      }
    });

    // Create a formatted data object for the API
    const apiData = {
      basicInfo: formData.basicInfo,
      fields: formattedFields,
      communication: formData.communication
    };
    
    // Show data structure in an alert before sending
    const dataPreview = {
      Event_Name: formData.basicInfo.eventName,
      Event_Start_Date: formData.basicInfo.startDate,
      Event_End_Date: formData.basicInfo.endDate,
      Event_Logo: formData.basicInfo.eventLogo ? formData.basicInfo.eventLogo.name : "No file selected",
      Table_Structure: formattedFields, // Use formatted fields here
      Event_IsEmail: formData.communication.contactMethods.email ? "1" : "0",
      Event_Email_Column_Name: formData.communication.contactMethods.email ? formData.communication.contactMethods.emailField : "",
      Event_WhatsApp_Template_ID: formData.communication.contactMethods.whatsapp ? formData.communication.contactMethods.whatsappTemplateId : "",
      Event_WhatsApp_Column_Name: formData.communication.contactMethods.whatsapp ? formData.communication.contactMethods.whatsappField : "",
      Event_IsQuiz: formData.communication.contactMethods.quiz ? "1" : "0",
      Event_IsPoll: formData.communication.contactMethods.polls ? "1" : "0",
      Event_IsQRCode: formData.communication.contactMethods.qrCode ? "1" : "0",
      Event_IsFaceRec: formData.communication.contactMethods.faceRegistration ? "1" : "0"
    };

    // Show formatted data in an alert
    alert("Data to be submitted:\n" + JSON.stringify(dataPreview, null, 2));
    
    try {
      // Call the API function to create the event
      const result = await createEvent(apiData);
      console.log("Event created successfully:", result);
      onSubmit();
    } catch (error) {
      alert("Error creating event: " + error.message);
      console.error("Event creation failed:", error);
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.fields.map((field, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{field.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.type === 'enum' 
                        ? `ENUM (${field.enumValues.join(', ')})` 
                        : `${field.type.toUpperCase()}${field.length ? `(${field.length})` : ''}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.required ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.unique ? 'Yes' : 'No'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No fields added.</p>
        )}
      </div>
      
      {/* Communication Methods Summary */}
      <div className="mb-8 p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-4">Communication Methods</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">WhatsApp</p>
            <p className="font-medium">
              {formData.communication.contactMethods.whatsapp 
                ? `Enabled (Field: ${formData.communication.contactMethods.whatsappField})` 
                : 'Disabled'}
            </p>
            {formData.communication.contactMethods.whatsapp && formData.communication.contactMethods.whatsappTemplateId && (
              <p className="text-sm text-gray-500">Template ID: {formData.communication.contactMethods.whatsappTemplateId}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">
              {formData.communication.contactMethods.email 
                ? `Enabled (Field: ${formData.communication.contactMethods.emailField})` 
                : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">QR Code Registration</p>
            <p className="font-medium">
              {formData.communication.contactMethods.qrCode ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Face Registration</p>
            <p className="font-medium">
              {formData.communication.contactMethods.faceRegistration ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Quiz Feature</p>
            <p className="font-medium">
              {formData.communication.contactMethods.quiz ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Polls Feature</p>
            <p className="font-medium">
              {formData.communication.contactMethods.polls ? 'Enabled' : 'Disabled'}
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
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  )
}