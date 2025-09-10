import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { getAllEvents } from "../utils/EventFetchApi";
import { useNavigate } from "react-router-dom";
import { createCredential } from "../utils/Credentials";
import toast from "react-hot-toast";

export default function CreateNewCredentials() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Admin",
    eventId: "",
    
  });

  const [showEventId, setShowEventId] = useState(false);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // Fetch events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getAllEvents(1, 100);

        if (response && response.events) {
          const eventIds = response.events.events.map(
            (event) => event.Event_ID
          );
          setEvents(eventIds);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "role") {
      setShowEventId(value === "Client" || value === "Scanner" ||value ==="faceDetect" );
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "eventId") {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Implement fuzzy search for Event ID
      if (value.trim() === "") {
        setFilteredEvents([]);
        setIsSearching(false);
      } else {
        const filtered = events.filter((eventId) =>
          eventId.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredEvents(filtered);
        setIsSearching(true);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle event selection from dropdown
  const handleEventSelect = (eventId) => {
    setFormData({
      ...formData,
      eventId,
    });
    setIsSearching(false);
  };

  // Handle form submission  Validate Required Fields

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createCredential(formData);
      console.log(response)
      toast.success("Credential created successfully!");

      // Redirect to credentials list after a short delay
      setTimeout(() => {
        navigate("/dashboard?tab=credentials&view=display");
      }, 500);
    } catch (error) {
      toast.error(error.response.data.Message || "Failed to create credential");
    }
  };

  const handleCancel = () => {
    // Reset form data or navigate away
    setFormData({
      username: "",
      password: "",
      role: "Admin",
      eventId: "",
    });
    setShowEventId(false);
    setFilteredEvents([]);
    setIsSearching(false);
    setTimeout(() => {
      navigate("/dashboard?tab=credentials&view=display");
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12 sm:space-y-10">
        <div>
          <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
          <p className="mt-1 max-w-2xl text-sm/6 text-gray-600">
            This information will be displayed on Credentials and can be visible
            to other users.
          </p>
        </div>

        <div>
          <div className="mt-10  space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
              >
                UserName
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-xs sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
              >
                Password
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-xs sm:text-sm/6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label
                htmlFor="role"
                className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
              >
                Role
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="grid grid-cols-1 sm:max-w-xs">
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Client">Client</option>
                    <option value="Scanner">Scanner</option>
                    <option value="faceDetect">Face Detector</option>
                  </select>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  />
                </div>
              </div>
            </div>

            {showEventId && (
              <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
                <label
                  htmlFor="eventId"
                  className="block text-sm/6 font-medium text-gray-900 sm:pt-1.5"
                >
                  Event Id
                </label>
                <div className="mt-2 sm:col-span-2 sm:mt-0 relative">
                  <input
                    id="eventId"
                    name="eventId"
                    type="text"
                    value={formData.eventId}
                    onChange={handleInputChange}
                    autoComplete="off"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:max-w-md sm:text-sm/6"
                  />

                  {/* Fuzzy search dropdown */}
                  {isSearching && filteredEvents.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      <ul className="py-1">
                        {filteredEvents.map((eventId, index) => (
                          <li
                            key={index}
                            className="px-3 py-2 text-sm text-gray-700 hover:bg-indigo-100 cursor-pointer"
                            onClick={() => handleEventSelect(eventId)}
                          >
                            {eventId}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {isSearching && filteredEvents.length === 0 && (
                    <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg p-2">
                      <p className="text-sm text-gray-500">
                        No matching events found
                      </p>
                    </div>
                  )}

                  {isLoading && (
                    <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-300 rounded-md shadow-lg p-2">
                      <p className="text-sm text-gray-500">Loading events...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8  flex items-center justify-end gap-x-8">
        <button
          onClick={handleCancel}
          type="button"
          className="text-lg px-10 py-3  font-semibold text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-[linear-gradient(90deg,#2BC155_7.39%,#7BF29C_104.06%)] px-6 py-3 text-lg font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}
