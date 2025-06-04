"use client"

import { useState } from "react"

import PollTable from "./PollTable"
import CreateNewPoll from "./CreateNewPoll"
import ViewPoll from "./ViewPoll"

export default function PollSection() {
  const [view, setView] = useState("display")
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedPollId, setSelectedPollId] = useState(null)

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleEdit = (pollId) => {
    setSelectedPollId(pollId)
    setView("edit")
  }

  const handleView = (pollId) => {
    setSelectedPollId(pollId)
    setView("view")
  }

  const renderContent = () => {
    switch (view) {
      case "display":
        return <PollTable onRefresh={refreshTrigger} onEdit={handleEdit} onView={handleView} />
      case "create":
        return (
          <CreateNewPoll
            onSuccess={() => {
              setView("display")
              handleRefresh()
            }}
            onCancel={() => setView("display")}
          />
        )
      case "edit":
        return (
          <CreateNewPoll
            pollId={selectedPollId}
            isEditMode={true}
            onSuccess={() => {
              setView("display")
              handleRefresh()
            }}
            onCancel={() => setView("display")}
          />
        )
      case "view":
        return <ViewPoll pollId={selectedPollId} onBack={() => setView("display")} />
      default:
        return <PollTable onRefresh={refreshTrigger} />
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900">Polls Section</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your event polls</p>
        </div>
        <div className="mt-4 sm:mt-0">
          {view === "display" && (
            <button
              type="button"
              onClick={() => setView("create")}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add New Poll
            </button>
          )}
          {(view === "create" || view === "edit" || view === "view") && (
            <button
              type="button"
              onClick={() => setView("display")}
              className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
            >
              Back to Polls
            </button>
          )}
        </div>
      </div>

      {renderContent()}
    </div>
  )
}
