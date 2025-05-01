// ClientSection.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ClientDataTable from './ClientDataTable'

import CreateNewClientEvent from './CreateNewClientEvent'

export default function ClientSection({ /* any props you need */ }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState('display')  // 'display' or 'create'

  // read `view` from query string on mount / URL change
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const v = params.get('view')
    if (v === 'create' || v === 'display') setView(v)
  }, [location.search])

  // toggles view and pushes new URL
  const toggleView = () => {
    const next = view === 'display' ? 'create' : 'display'
    setView(next)
    navigate(`?view=${next}`)
  }

  return (
    <div>
      {/* header + toggle button */}
      <div className="border-b border-gray-200 pb-4 mb-6 flex items-center">
        <button
          onClick={toggleView}
          className="inline-flex items-center rounded-2xl bg-emerald-700 px-3 py-2 text-md font-semibold text-white shadow hover:bg-emerald-600"
        >
          {view === 'display' ? 'Add New Client' : 'Show Clients'}
        </button>
      </div>

      {/* conditional rendering */}
      {view === 'display'
        ? <ClientDataTable  />
        : <CreateNewClientEvent />
      }
    </div>
  )
}
