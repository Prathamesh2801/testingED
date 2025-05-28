import React, { useState } from 'react'

export default function CommunicationMethods({ onSubmit, onPrevious, formData }) {
  // Update the initial state to include all form fields
  const [contactMethods, setContactMethods] = useState({
    whatsapp: formData?.contactMethods?.whatsapp || false,
    email: formData?.contactMethods?.email || false,
    qrCode: formData?.contactMethods?.qrCode || false,
    faceRegistration: formData?.contactMethods?.faceRegistration || false,
    quiz: formData?.contactMethods?.quiz || false,
    polls: formData?.contactMethods?.polls || false,
    app: formData?.contactMethods?.app || false
  });

  const [selectedFields, setSelectedFields] = useState({
    whatsapp: formData?.contactMethods?.whatsappField || '',
    email: formData?.contactMethods?.emailField || ''
  });

  const [templateIds, setTemplateIds] = useState({
    whatsapp: formData?.contactMethods?.whatsappTemplateId || ''
  })

  // Filter fields by type from the previous step
  const numberFields = formData.fields.filter(field => field.type === 'int');
  const varcharFields = formData.fields.filter(field => field.type === 'varchar');

  const handleContactMethodChange = (e) => {
    const { name, checked } = e.target;
    setContactMethods(prev => ({
      ...prev,
      [name]: checked
    }));

    // Reset selected field if unchecked
    if (!checked && (name === 'whatsapp' || name === 'email')) {
      setSelectedFields(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Update the handleFieldSelect function
  const handleFieldSelect = (e, methodName) => {
    const value = e.target.value || ''; // Ensure empty string if value is undefined
    setSelectedFields(prev => ({
      ...prev,
      [methodName]: value
    }));
  };

  // Update the handleTemplateIdChange function
  const handleTemplateIdChange = (e, methodName) => {
    const value = e.target.value || ''; // Ensure empty string if value is undefined
    setTemplateIds(prev => ({
      ...prev,
      [methodName]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Combine communication methods data
    const communicationData = {
      contactMethods: {
        whatsapp: contactMethods.whatsapp,
        email: contactMethods.email,
        qrCode: contactMethods.qrCode,
        faceRegistration: contactMethods.faceRegistration,
        // Add additional features
        quiz: contactMethods.quiz,
        polls: contactMethods.polls,
        app:contactMethods.app,
        // Fields and template data
        whatsappField: selectedFields.whatsapp,
        whatsappTemplateId: templateIds.whatsapp,
        emailField: selectedFields.email,
      }
    };

    // Debug log to verify data
    console.log('Submitting communication data:', communicationData);
    
    // Verify additional features specifically
    console.log('Additional features:', {
      quiz: contactMethods.quiz,
      polls: contactMethods.polls,
      app: contactMethods.app
    });

    onSubmit(communicationData);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Communication Methods</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-8 p-6 border rounded-lg">
          <div className="space-y-4">
            {/* WhatsApp */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="whatsapp"
                  name="whatsapp"
                  checked={contactMethods.whatsapp}
                  onChange={handleContactMethodChange}
                  className="mr-2 h-4 w-4 text-indigo-600"
                />
                <label htmlFor="whatsapp" className="text-gray-700 font-medium">WhatsApp</label>
              </div>

              {contactMethods.whatsapp && (
                <div className="ml-6 space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">
                      Select Phone Number Field
                    </label>
                    <select
                      value={selectedFields.whatsapp || ''}
                      onChange={(e) => handleFieldSelect(e, 'whatsapp')}
                      className="w-full p-2 border rounded"
                      required={contactMethods.whatsapp}
                    >
                      <option value="">Select a field</option>
                      {numberFields.map((field, index) => (
                        <option key={index} value={field.name}>
                          {field.name}
                        </option>
                      ))}
                    </select>
                    {numberFields.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        No number fields available. Please add a number field in the previous step.
                      </p>
                    )}
                  </div>
                  {selectedFields.whatsapp && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-600">
                      WhatsApp Template ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Template ID"
                      value={templateIds.whatsapp || ''}
                      onChange={(e) => handleTemplateIdChange(e, 'whatsapp')}
                      className="w-full p-2 border rounded"
                      required={contactMethods.whatsapp}
                    />
                  </div>
                      )}
                </div>
              )}

            </div>

            {/* Email */}
            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="email"
                  name="email"
                  checked={contactMethods.email}
                  onChange={handleContactMethodChange}
                  className="mr-2 h-4 w-4 text-indigo-600"
                />
                <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
              </div>

              {contactMethods.email && (
                <div className="ml-6">
                  <label className="block mb-2 text-sm font-medium text-gray-600">
                    Select Email Field
                  </label>
                  <select
                    value={selectedFields.email || ''}
                    onChange={(e) => handleFieldSelect(e, 'email')}
                    className="w-full p-2 border rounded"
                    required={contactMethods.email}
                  >
                    <option value="">Select a field</option>
                    {varcharFields.map((field, index) => (
                      <option key={index} value={field.name}>
                        {field.name}
                      </option>
                    ))}
                  </select>
                  {varcharFields.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      No text fields available. Please add a VARCHAR field in the previous step.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Registration Methods */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Registration Methods</h4>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="qrCode"
                    checked={contactMethods.qrCode}
                    onChange={handleContactMethodChange}
                    className="mr-2 h-4 w-4 text-indigo-600"
                  />
                  QR Code Registration
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="faceRegistration"
                    checked={contactMethods.faceRegistration}
                    onChange={handleContactMethodChange}
                    className="mr-2 h-4 w-4 text-indigo-600"
                  />
                  Face Registration
                </label>
              </div>
            </div>
            
            {/* Features Sections */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Additional Features</h4>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="quiz"
                    checked={contactMethods.quiz}
                    onChange={handleContactMethodChange}
                    className="mr-2 h-4 w-4 text-indigo-600"
                  />
                 Quiz
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="polls"
                    checked={contactMethods.polls}
                    onChange={handleContactMethodChange}
                    className="mr-2 h-4 w-4 text-indigo-600"
                  />
                Polls
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="app"
                    checked={contactMethods.app}
                    onChange={handleContactMethodChange}
                    className="mr-2 h-4 w-4 text-indigo-600"
                  />
                App
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}