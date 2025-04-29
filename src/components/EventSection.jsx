"use client"
import { useNavigate, useLocation } from "react-router-dom"
import DisplayEvents from "./DisplayEvents"
import CreateNewEvent from "./CreateNewEvent"
import ViewEvent from "./ViewEvent"
import { useState, useEffect } from "react"

export default function EventSection({ events, loading, error, pagination, handlePageChange, setEvents, onRefresh }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentView, setCurrentView] = useState("display")
  const [viewEventId, setViewEventId] = useState(null)

  // Get parameters from the URL query string
  const queryParams = new URLSearchParams(location.search)
  const viewParam = queryParams.get("view")
  const eventIdParam = queryParams.get("eventId")

  // Set the view based on URL parameters on initial load and when they change
  useEffect(() => {
    console.log("URL params changed:", { viewParam, eventIdParam })

    if (viewParam) {
      setCurrentView(viewParam)
    }

    if (eventIdParam) {
      setViewEventId(eventIdParam)
    }
  }, [location.search, viewParam, eventIdParam])

  // Handle view event 
  const handleEventView = (eventId) => {
    setViewEventId(eventId);
    setCurrentView("viewEvent");
    navigate(`/dashboard?tab=events&view=viewEvent&eventId=${eventId}`);
  };

  // Handle navigation between event views
  const toggleEventView = () => {
    if (currentView === "viewEvent") {
      setCurrentView("display");
      navigate(`/dashboard?tab=events`);
    } else {
      const newView = currentView === "display" ? "create" : "display";
      setCurrentView(newView);
      navigate(`/dashboard?tab=events&view=${newView}`);
    }
  }

  return (
    <div>
      {/* Button to toggle between views */}
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          {currentView === "create" ? "Create New Event" : 
           currentView === "viewEvent" ? "View Event Details" : "Events List"}
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={toggleEventView}
            className="inline-flex items-center rounded-2xl bg-emerald-700 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {currentView === "display" ? "Create New Event" : 
             currentView === "viewEvent" ? "Back to Events" : "Display All Events"}
          </button>
        </div>
      </div>

      {/* Render the appropriate component based on the currentView */}
      {currentView === "create" ? (
        <CreateNewEvent onRefresh={onRefresh} />
      ) : currentView === "viewEvent" ? (
        <ViewEvent viewEventId={viewEventId} />
      ) : (
        <DisplayEvents
          events={events}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRefresh={onRefresh}
          onEventView={handleEventView}
        />
      )}
    </div>
  )
}