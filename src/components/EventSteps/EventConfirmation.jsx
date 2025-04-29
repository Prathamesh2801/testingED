import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllEvents } from '../../utils/EventFetchApi'
import toast from 'react-hot-toast';

export default function EventConfirmation({ onRefresh }) {
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      setStatus('success');

      try {
        // Fetch latest events data
        const refreshedData = await getAllEvents();

        toast.success('Event created successfully!', {
          duration: 2000,
        });
        // Short delay before navigation to ensure UI animation completes
        setTimeout(() => {
          if (onRefresh) {
            onRefresh(refreshedData); // Call parent refresh function if provided
          }
          navigate('/dashboard?tab=events&view=display');
        }, 1000);
      } catch (error) {
        console.error('Error fetching updated events:', error);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, onRefresh]);

  return (
    <div className="max-w-xl mx-auto text-center p-6">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Creating Your Event</h2>
          <p className="text-gray-600">Please wait while we process your request...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Success!</h2>
          <p className="text-lg mb-8 text-gray-600">Your event has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to events list...</p>
        </div>
      )}
    </div>
  );
}