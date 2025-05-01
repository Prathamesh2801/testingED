import React, { useEffect, useState } from 'react'
import { fetchEvents, registerEvent } from '../utils/EventFetchApi';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function CreateNewClientEvent() {
  const eventId = localStorage.getItem("eventId")
  const [eventData, setEventData] = useState(null)
  const [formData, setFormData] = useState({})
  const [fileData, setFileData] = useState({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

  useEffect(() => {
    if (!eventId) {
      setLoading(false)
      setError("No event ID found")
      return
    }

    async function loadEventData() {
      try {
        setLoading(true)
        const data = await fetchEvents(eventId)
        setEventData(data.Data)

        // initialize formData
        const initialFormData = {}
        data.Data.fields.forEach(field => {
          initialFormData[field.name] = ""
        })
        setFormData(initialFormData)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load event data")
        setLoading(false)
      }
    }

    loadEventData()
  }, [eventId])

  // Handle text/number input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFileData({
        ...fileData,
        [name]: files[0]
      })
    }
  }

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Create a FormData object to handle file uploads
      const submitFormData = new FormData()
      
      // Add all regular form fields
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key])
      })
      
      // Add file fields
      Object.keys(fileData).forEach(key => {
        submitFormData.append(key, fileData[key])
      })
      
      // Add event ID
      submitFormData.append('eventId', eventId)
      console.log("Form data to be submitted:", formData);
      const response = await registerEvent(eventId, formData);
      console.log("Registration response:", response)
      toast.success("Registration successful!")
      // Reset form or redirect as needed
        setFormData({})
        setFileData({})
        setError("")
        setTimeout(() => {
            navigate('/clientDashboard?view=display');
          }, 1000);

    } catch (err) {
      console.error(err)
      setError("Failed to submit form")
    }
  }

  // Render field based on type
  const renderField = (field) => {
    const { name, type, required, comment, isFile, allowedTypes } = field
    
    // Format label from field name
    const formatLabel = (name) => {
      return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }

    // For file uploads
    if (isFile) {
      return (
        <div key={name} className="col-span-full">
          <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
            {formatLabel(name)} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor={name}
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input 
                    id={name} 
                    name={name} 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileChange}
                    accept={allowedTypes ? allowedTypes.map(type => `.${type}`).join(',') : undefined}
                    required={required}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs/5 text-gray-600">
                {allowedTypes 
                  ? `${allowedTypes.join(', ').toUpperCase()} files accepted` 
                  : 'All files accepted'}
              </p>
              {fileData[name] && (
                <p className="mt-2 text-sm text-gray-600">Selected: {fileData[name].name}</p>
              )}
            </div>
          </div>
        </div>
      )
    }
    
    // For enum types (dropdowns)
    if (type.includes('enum')) {
      // Extract enum values from the type string - format is enum('value1','value2',...)
      const enumMatch = type.match(/enum\((.+)\)/)
      const enumValues = enumMatch 
        ? enumMatch[1].split(',').map(val => val.replace(/'/g, '').trim()) 
        : []
        
      return (
        <div key={name} className="sm:col-span-3">
          <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
            {formatLabel(name)} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="mt-2 grid grid-cols-1">
            <select
              id={name}
              name={name}
              value={formData[name] || ''}
              onChange={handleInputChange}
              required={required}
              className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            >
              <option value="">Select {formatLabel(name)}</option>
              {enumValues.map(value => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            />
          </div>
        </div>
      )
    }
    
    // For text, email, number inputs
    let inputType = 'text'
    if (name === 'email') inputType = 'email'
    else if (type.includes('int') || type.includes('bigint')) inputType = 'number'
    
    return (
      <div key={name} className="sm:col-span-3">
        <label htmlFor={name} className="block text-sm/6 font-medium text-gray-900">
          {formatLabel(name)} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-2">
          <input
            id={name}
            name={name}
            type={inputType}
            value={formData[name] || ''}
            onChange={handleInputChange}
            required={required}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
    )
  }

  if (loading) return <div className="text-center py-10">Loading event data...</div>
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>
  if (!eventData) return <div className="text-center py-10">No event data available</div>

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900">{eventData.event.Event_Name} Registration</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Please fill in the following details to register for this event.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {eventData.fields.map(field => renderField(field))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Register
        </button>
      </div>
    </form>
  )
}