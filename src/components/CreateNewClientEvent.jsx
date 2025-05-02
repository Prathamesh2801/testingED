import React, { useEffect, useState } from 'react'
import { fetchEvents } from '../utils/EventFetchApi'
import { editUserDataClient, getSpecificUserData } from '../utils/ClientData'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function CreateNewClientEvent({ userId }) {
  const eventId = localStorage.getItem('eventId')
  const [eventData, setEventData] = useState(null)
  const [formData, setFormData] = useState({})
  const [fileData, setFileData] = useState({})
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
      setFileData(prev => ({ ...prev, [name]: files[0] }))
    }
  }

  // Submit handler
  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const submitData = new FormData()

      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })
      Object.keys(fileData).forEach(key => {
        submitData.append(key, fileData[key])
      })

      submitData.append('eventId', eventId)

      let response
      if (isEdit) {
        response = await editUserDataClient({ User_ID: userId, ...formData })
      } else {
        response = await registerEvent(eventId, formData)
      }

      console.log('Response:', response)
      toast.success(isEdit ? 'Changes saved!' : 'Registration successful!')
      setError('')
      setTimeout(() => navigate('/clientDashboard?view=display'), 1000)
    } catch (err) {
      console.error(err)
      setError('Failed to submit form')
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
          <label htmlFor={name} className="block text-sm font-medium">
            {label} {required && '*'}
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed px-6 py-10">
            <div className="text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
              <label htmlFor={name} className="mt-4 cursor-pointer font-semibold text-indigo-600">
                <span>Upload a file</span>
                <input
                  id={name}
                  name={name}
                  type="file"
                  className="sr-only"
                  onChange={handleFileChange}
                  accept={allowedTypes?.map(t => `.${t}`).join(',')}
                  required={required}
                />
              </label>
              {fileData[name] && <p className="mt-2 text-sm">{fileData[name].name}</p>}
            </div>
          </div>
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
            <ChevronDownIcon className="pointer-events-none absolute right-2 top-3 h-5 w-5 text-gray-500" />
          </div>
        </div>
      )
    }

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
          className="text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-green-500 px-6 py-3 text-md font-semibold text-white"
        >
          {isEdit ? 'Save Changes' : 'Register'}
        </button>
      </div>
    </form>
  )
}
