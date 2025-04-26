import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DisplayEvents from './DisplayEvents';
import CreateNewEvent from './CreateNewEvent';
import { API_BASE_URL } from '../config';

export default function EventSection({ events, loading, error, pagination, handlePageChange,setEvents }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the current event view from query parameter or default to 'display'
  const queryParams = new URLSearchParams(location.search);

  const eventView = queryParams.get('view') || 'display';

    // Handle refreshing events after creation
    const handleEventRefresh = (refreshedData) => {
      if (refreshedData && refreshedData.events) {
        setEvents(refreshedData.events);
      }
    };
  
  // Handle navigation between event views
  const toggleEventView = () => {
    const newView = eventView === 'display' ? 'create' : 'display';
    navigate(`/dashboard?tab=events&view=${newView}`);
  };
  
  return (
    <div>
      {/* Button to toggle between views */}
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900">
          {eventView === 'create' ? 'Create New Event' : 'Events List'}
        </h3>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <button
            type="button"
            onClick={toggleEventView}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {eventView === 'display' ? 'Create New Event' : 'Display All Events'}
          </button>
        </div>
      </div>
      
      {/* Render the appropriate component based on the eventView */}
      {eventView === 'create' ? (
        <CreateNewEvent onRefresh={handleEventRefresh} />
      ) : (
        <DisplayEvents 
          events={events} 
          loading={loading} 
          error={error} 
          pagination={pagination} 
          handlePageChange={handlePageChange}
          navigate={navigate}
          API_BASE_URL={API_BASE_URL}
        />
      )}
    </div>
  );
}