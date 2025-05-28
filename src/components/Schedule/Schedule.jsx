import React, { useState } from 'react'
import ScheduleTable from './ScheduleTable'
import CreateNewSchedule from './CreateNewSchedule'

export default function Schedule() {
  const [view, setView] = useState('display') // 'display' or 'create'
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900">Event Schedule</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your event schedules and activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setView(view === 'display' ? 'create' : 'display')}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {view === 'display' ? 'Add New Schedule' : 'View Schedules'}
          </button>
        </div>
      </div>

      {view === 'display' ? (
        <ScheduleTable onRefresh={refreshTrigger} />
      ) : (
        <CreateNewSchedule 
          onSuccess={() => {
            setView('display')
            handleRefresh()
          }}
          onCancel={() => setView('display')}
        />
      )}
    </div>
  )
}