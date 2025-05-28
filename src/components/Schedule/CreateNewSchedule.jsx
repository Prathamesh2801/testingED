import React, { useState } from 'react'

import toast from 'react-hot-toast'
import { createSchedule } from '../../utils/Schedule'

export default function CreateNewSchedule({ onSuccess, onCancel }) {
  const eventId = localStorage.getItem('eventId')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    speaker: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    // Check if end date is before start date
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error('End date cannot be before start date')
      return
    }

    setLoading(true)
    
    try {
        console.log("Event Id : ",eventId)
        console.log("Before Creating : ",formData)
      await createSchedule({
        eventId,
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        speaker: formData.speaker
      })
      
      toast.success('Schedule created successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error creating schedule:', error)
      toast.error(error.message || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Schedule</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Title */}
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full p-2  border  rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="sm:col-span-3">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="sm:col-span-3">
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Start Time <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  step="1"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                End Time <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  step="1"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Speaker */}
            <div className="sm:col-span-3">
              <label htmlFor="speaker" className="block text-sm font-medium text-gray-700">
                Speaker
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="speaker"
                  id="speaker"
                  value={formData.speaker}
                  onChange={handleChange}
                  className="block w-full p-2 border rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}