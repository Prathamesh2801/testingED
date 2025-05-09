import React, { useState } from 'react'

export default function EventBasicInfo({ onSubmit, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    eventName: '',
    eventLogo: null,
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-6 mb-6">
          <div className="w-full relative">
            <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
              Event Name 
              <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
              </svg>
            </label>
            <input 
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
          <div className="w-full relative">
            <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
              Event Logo
            </label>
            <input 
              type="file"
              name="eventLogo"
              onChange={handleChange}
              className="block w-full text-sm h-11 px-5 py-2.5 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              accept="image/*"
              required
            />
          </div>
        </div>

        <div className=" flex flex-col md:flex-row gap-y-4 md:gap-y-0 md:gap-x-6 mb-6">
          <div className="w-full relative">
            <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
              Event Start Date 
              <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
              </svg>
            </label>
            <input 
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
          <div className="w-full relative">
            <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
              Event End Date 
              <svg width="7" height="7" className="ml-1" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z" fill="#EF4444" />
              </svg>
            </label>
            <input 
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none"
              required
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-52 h-12 shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7"
        >
          Next
        </button>
      </form>
    </div>
  )
}