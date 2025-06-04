import  { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { createPoll, updatePoll, fetchSpecificPoll } from "../../utils/Poll";

export default function CreateNewPoll({ onSuccess, onCancel, pollId = null, isEditMode = false }) {
  const eventId = localStorage.getItem("eventId");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    live: false,
  });

  // Fetch poll data for edit mode
  useEffect(() => {
    const fetchPollData = async () => {
      if (isEditMode && pollId) {
        try {
          setInitialLoading(true);
          const response = await fetchSpecificPoll(eventId, pollId);
          setFormData({
            question: response.Question || "",
            option1: response.Option1 || "",
            option2: response.Option2 || "",
            option3: response.Option3 || "",
            option4: response.Option4 || "",
            live: response.Live === 1,
          });
        } catch (error) {
          console.error("Error fetching poll data:", error);
          toast.error("Failed to load poll data");
          onCancel();
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchPollData();
  }, [isEditMode, pollId, eventId, onCancel]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.question.trim()) {
      toast.error("Question is required.");
      return;
    }

    setLoading(true);

    const rawOptions = [
      formData.option1,
      formData.option2,
      formData.option3,
      formData.option4,
    ];

    const options = rawOptions
      .map((opt) => opt.trim())
      .filter((opt) => opt.length > 0); 

    if (options.length < 2) {
      toast.error("Please provide at least two valid options.");
      setLoading(false);
      return;
    }

    try {
      let response;
      if (isEditMode) {
        response = await updatePoll(
          eventId, 
          pollId, 
          formData.question.trim(), 
          options, 
          formData.live
        );
        toast.success(response.Message || "Poll updated successfully!");
      } else {
        response = await createPoll(eventId, formData.question.trim(), options);
        console.log("Response : ",response)
        toast.success(response.Message || "Poll created successfully!");
      }
      
      // Reset form if creating new poll
      if (!isEditMode) {
        setFormData({
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          live: false,
        });
      }

      onSuccess(); 
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} poll:`, error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} poll`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-6">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {isEditMode ? "Edit Poll" : "Create New Poll"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Question */}
            <div className="sm:col-span-6">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700"
              >
                Question <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="question"
                  id="question"
                  value={formData.question}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Option 1 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="option1"
                className="block text-sm font-medium text-gray-700"
              >
                Option 1 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="option1"
                  id="option1"
                  value={formData.option1}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Option 2 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="option2"
                className="block text-sm font-medium text-gray-700"
              >
                Option 2 <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="option2"
                  id="option2"
                  value={formData.option2}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Option 3 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="option3"
                className="block text-sm font-medium text-gray-700"
              >
                Option 3
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="option3"
                  id="option3"
                  value={formData.option3}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Option 4 */}
            <div className="sm:col-span-3">
              <label
                htmlFor="option4"
                className="block text-sm font-medium text-gray-700"
              >
                Option 4
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="option4"
                  id="option4"
                  value={formData.option4}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Live Status (only show in edit mode) */}
            {isEditMode && (
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="live"
                    id="live"
                    checked={formData.live}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="live" className="ml-2 block text-sm text-gray-700">
                    Poll is active (Live)
                  </label>
                </div>
              </div>
            )}
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
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Poll" : "Create Poll")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}