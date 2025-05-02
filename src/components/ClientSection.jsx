import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ClientDataTable from './ClientDataTable'
import CreateNewClientEvent from './CreateNewClientEvent'
import { fetchEvents } from '../utils/EventFetchApi'
import { SiWhatsapp } from '@icons-pack/react-simple-icons';
import { MailPlus } from 'lucide-react'

export default function ClientSection() {
  const eventId = localStorage.getItem("eventId")
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState('display')
  const [userId, setUserId] = useState(null)
  const [eventData, setEventData] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const v = params.get('view')
    if (v === 'create' || v === 'display') setView(v)
    setUserId(params.get('userId'))
  }, [location.search])

  const toggleView = () => {
    const next = view === 'display' ? 'create' : 'display'
    setView(next)
    navigate(`?view=${next}`)
  }

  useEffect(() => {
    if (!eventId) return

    async function loadEventData() {
      try {
        const data = await fetchEvents(eventId)
        console.log("Event Data:", data)
        setEventData(data.Data.event)
      } catch (err) {
        console.error(err)
      }
    }

    loadEventData()
  }, [eventId])

  return (
    <div>

      <div className="border-b border-gray-200 pb-4 mb-6 flex items-center">
        <button
          onClick={toggleView}
          className="inline-flex items-center rounded-2xl bg-emerald-700 px-3 py-2 text-md font-semibold text-white shadow hover:bg-emerald-600"
        >
          {view === 'display' ? 'Add New User' : 'Show Users'}
        </button>
        <div className='ml-auto flex items-center space-x-4'>

          {eventData?.Event_WhatsApp_Column_Name && eventData?.Event_WhatsApp_Template_ID && (
            <SiWhatsapp className="w-8 h-8 text-green-500 ml-4" />
          )}
          {eventData?.IsEmail === "1" && (
            <MailPlus className="w-8 h-8 text-red-500 ml-4" />
          )}
        </div>
      </div>

      {/* conditional rendering */}
      {view === 'display'
        ? <ClientDataTable />
        : <CreateNewClientEvent  userId={userId}  />
      }
    </div>
  )
}
