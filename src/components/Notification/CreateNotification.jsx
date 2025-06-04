import  { useState, useEffect } from "react";
import { createNotifications, editNotification } from "../../utils/Notifications";
import toast from "react-hot-toast";

export default function CreateNotification({ editingNotification, onSuccess, onCancel }) {
  const eventId = localStorage.getItem("eventId");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "success"
  });

  const isEditing = Boolean(editingNotification);

  // Populate form when editing
  useEffect(() => {
    if (editingNotification) {
      setFormData({
        title: editingNotification.Title || "",
        message: editingNotification.Message || "",
        type: editingNotification.Type || "success"
      });
    } else {
      // Reset form for new notification
      setFormData({
        title: "",
        message: "",
        type: "success"
      });
    }
  }, [editingNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    try {
      if (isEditing) {
        // Edit existing notification
        await editNotification({
          eventId,
          title: formData.title.trim(),
          message: formData.message.trim(),
          type: formData.type,
          notificationId: editingNotification.Notification_ID
        });
        toast.success("Notification updated successfully!");
      } else {
        // Create new notification
        await createNotifications({
          eventId,
          title: formData.title.trim(),
          message: formData.message.trim(),
          type: formData.type
        });
        toast.success("Notification created successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      console.error("Error saving notification:", error);
      toast.error(error.message || `Failed to ${isEditing ? 'update' : 'create'} notification`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {isEditing ? 'Edit Notification' : 'Create New Notification'}
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Type */}
            <div className="sm:col-span-2">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Type <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <select 
                  name="type" 
                  id="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={loading}
                >
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div className="sm:col-span-6">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                  rows={4}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-5">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Notification' : 'Create Notification'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}