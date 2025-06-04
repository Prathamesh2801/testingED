import { useState } from 'react'
import NotificationTable from './NotificationTable'
import CreateNotification from './CreateNotification'
import { fetchSpecificNotifications } from '../../utils/Notifications'

export default function NotificationSection() {
  const [view, setView] = useState('display') // 'display', 'create', or 'edit'
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingNotification, setEditingNotification] = useState(null)

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleCreateNew = () => {
    setEditingNotification(null)
    setView('create')
  }

 const handleEdit = async (notificationId) => {
  try {
    const eventId = localStorage.getItem("eventId");
    const fullData = await fetchSpecificNotifications(eventId, notificationId);


      setEditingNotification(fullData); 
      setView("edit");
  
  } catch (err) {
    console.error("Failed to fetch full notification:", err);
  }
};

  const handleBackToList = () => {
    setEditingNotification(null)
    setView('display')
    handleRefresh() // Refresh the list when returning
  }

  const handleSuccess = () => {
    setEditingNotification(null)
    setView('display')
    handleRefresh() // Refresh the list after successful operation
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900">Event Notification</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your event Notifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={view === 'display' ? handleCreateNew : handleBackToList}
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {view === 'display' ? 'Add New Notification' : 'View Notifications'}
          </button>
        </div>
      </div>

      {view === 'display' ? (
        <NotificationTable 
          onRefresh={refreshTrigger}
          onEdit={handleEdit}
        />
      ) : (
        <CreateNotification
          editingNotification={editingNotification}
          onSuccess={handleSuccess}
          onCancel={handleBackToList}
        />
      )}
    </div>
  )
}