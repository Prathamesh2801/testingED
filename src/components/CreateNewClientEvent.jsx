import  { useEffect, useState } from 'react'
import { fetchEvents, registerEvent } from '../utils/EventFetchApi'
import { editUserDataClient, getSpecificUserData } from '../utils/ClientData'
import { PhotoIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
// import { User } from 'lucide-react'

// Helper to parse "base(type)" strings like "bigint(40)
function parseSqlType(typeStr) {
  const m = typeStr.match(/^(\w+)(?:\((\d+)\))?/) || []
  return {
    base: (m[1] || '').toLowerCase(),
    length: m[2] ? parseInt(m[2], 10) : null,
  }
}


export default function CreateNewClientEvent({ userId }) {
  const eventId = localStorage.getItem('eventId')
  const [eventData, setEventData] = useState(null)
  const [formData, setFormData] = useState({})
  // const [fileData, setFileData] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const isEdit = Boolean(userId)
  const navigate = useNavigate()
  // 1) Load event schema
  useEffect(() => {
    if (!eventId) {
      setError('No event ID found')
      setLoading(false)
      return
    }

    async function loadEventData() {
      try {
        setLoading(true)
        const data = await fetchEvents(eventId)
        setEventData(data.Data)
      } catch (err) {
        console.error(err)
        setError('Failed to load event data')
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [eventId])

  // 2) Build blank form schema when eventData arrives
  useEffect(() => {
    if (!eventData) return

    const initial = {}
    eventData.fields.forEach(field => {
      initial[field.name] = ''
    })

    setFormData(initial)
    setLoading(false)
  }, [eventData])

  // 3) If editing, merge existing user data
  useEffect(() => {
    async function init() {
      if (!isEdit || !eventData) return

      try {
        setLoading(true)
        const existing = await getSpecificUserData(userId)
        setFormData(prev => ({ ...prev, ...existing }))
      } catch (err) {
        console.error(err)
        setError('Failed to load existing data')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [isEdit, userId, eventData])

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = e => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
    }
  }



  // Render dynamic fields
  const renderField = field => {
    const { name, type, required, isFile, allowedTypes } = field

    const label = name
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

    if (isFile) {
       if (isEdit) return null // hide file upload fields in edit mode

      return (
        <div key={name} className="col-span-full">
          <label htmlFor={name} className="block text-sm font-medium mb-1">
            {label} {required && '*'}
          </label>

          {/* dropzone wrapper */}
          <label
            htmlFor={name}
            className="
                      flex flex-col items-center justify-center
                      w-full h-64
                      border-2 border-gray-300 border-dashed rounded-lg
                      bg-white hover:bg-gray-100
                      cursor-pointer
                      transition-colors duration-150
                    "
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {allowedTypes?.join(', ').toUpperCase()} (MAX. {Math.round(field.maxSize / 1024)} KB)
              </p>
              {formData[name] && (
                <p className="mt-2 text-sm text-gray-700">
                  Selected file: <span className="font-medium">{formData[name].name}</span>
                </p>
              )}
            </div>

            <input
              id={name}
              name={name}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={allowedTypes?.map(t => `.${t}`).join(',')}
              required={required}
            />
          </label>


        </div>

      )
    }

    if (type.includes('enum')) {
      const enumMatch = type.match(/enum\((.+)\)/)
      const options = enumMatch
        ? enumMatch[1].split(',').map(v => v.replace(/'/g, '').trim())
        : []

      return (
        <div key={name} className="sm:col-span-3">
          <label htmlFor={name} className="block text-sm font-medium">
            {label} {required && '*'}
          </label>
          <div className="mt-2 relative">
            <select
              id={name}
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              required={required}
              className="block w-full rounded-md py-1.5 pl-3 pr-8 text-base outline"
            >
              <option value="">Select {label}</option>
              {options.map(val => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>

          </div>
        </div>
      )
    }

    // Parse base type + length
    const { base, length } = parseSqlType(type)

    // Numeric types: only digits, enforce max length
    if (["int", "bigint", "smallint", "tinyint", "decimal", "float", "double"].includes(base)) {
      return (
        <div key={name} className="sm:col-span-3">
          <label htmlFor={name} className="block text-sm font-medium">
            {label} {required && '*'}
          </label>
          <input
            id={name}
            name={name}
            type="number"
            inputMode="numeric"
            pattern="\\d*"
            maxLength={length || undefined}
            value={formData[name] || ''}
            onChange={handleInputChange}
            required={required}
            className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline"
          />
          {length && (
            <p className="text-xs text-gray-500">Max {length} digits</p>
          )}
        </div>
      )
    }

    // varchar/char/text: enforce maxLength
    if (["varchar", "char", "text"].includes(base)) {
      return (
        <div key={name} className="sm:col-span-3">
          <label htmlFor={name} className="block text-sm font-medium">
            {label} {required && '*'}
          </label>
          <input
            id={name}
            name={name}
            type="text"
            maxLength={length || undefined}
            value={formData[name] || ''}
            onChange={handleInputChange}
            required={required}
            className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline"
          />
          {length && (
            <p className="text-xs text-gray-500">Max {length} characters</p>
          )}
        </div>
      )
    }

    // Fallback
    return (
      <div key={name} className="sm:col-span-3">
        <label htmlFor={name} className="block text-sm font-medium">
          {label} {required && '*'}
        </label>
        <input
          id={name}
          name={name}
          type={name === 'email' ? 'email' : 'text'}
          value={formData[name] || ''}
          onChange={handleInputChange}
          required={required}
          className="mt-2 block w-full rounded-md px-3 py-1.5 text-base outline"
        />
      </div>
    )
  }


  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {


      let response
      if (isEdit) {
        const payload = {
          User_ID: userId,
          Event_ID: eventId, // Explicitly include Event_ID
          ...formData,
        }
        response = await editUserDataClient(payload)
      } else {
        // Pass the object with Event_ID explicitly included
        response = await registerEvent(eventId, formData)
      }

      console.log("Response:", response)
      toast.success(isEdit ? "Changes saved!" : "Registration successful!")
      setError("")
      setTimeout(() => navigate("/clientDashboard?view=display"), 1000)
    } catch (err) {
      console.error("Submission error:", err)
      setError(err.message || "Failed to submit form")
      toast.error(err.message || "Failed to submit form")
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>
  if (!eventData) return <div className="text-center py-10">No event data</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      <div className="border-b pb-12">
        <h2 className="text-2xl font-semibold">
          {eventData.event.Event_Name} {isEdit ? 'Edit' : 'Registration'}
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {eventData.fields.map(renderField)}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/clientDashboard?view=display')}
          className='text-md font-semibold cursor-pointer px-6 py-3 rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-500 hover:text-white border border-red-500 hover:border-transparent'>
          Cancel
        </button>

        <button
          type="submit"
          className='rounded-xl px-6 py-3 text-md font-semibold text-green-600   cursor-pointer  transition-all duration-200 border border-green-500 hover:bg-green-600 hover:text-white'>
          {isEdit ? 'Save Changes' : 'Register'}
        </button>
      </div>
    </form>
  )
}
