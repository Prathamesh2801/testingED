import React, { useState } from 'react'
import EventBasicInfo from './EventSteps/EventBasicInfo'
import EventFields from './EventSteps/EventFields'
import CommunicationMethods from './EventSteps/CommunicationMethods'
import EventPreview from './EventSteps/EventPreview'
import EventConfirmation from './EventSteps/EventConfirmation'

function CreateNewEvent({onRefresh}) {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        basicInfo: {
            eventName: '',
            eventLogo: null,
            startDate: '',
            endDate: ''
        },
        fields: [],
        communication: {
            contactMethods: {
                whatsapp: false,
                email: false,
                qrCode: false,
                faceRegistration: false,
                whatsappField: '',
                emailField: ''
            }
        }
    })

    const handleBasicInfoSubmit = (basicData) => {
        setFormData(prev => ({
            ...prev,
            basicInfo: basicData
        }))
        setCurrentStep(2)
    }

    const handleFieldsSubmit = (fieldsData) => {
        setFormData(prev => ({
            ...prev,
            fields: fieldsData
        }))
        setCurrentStep(3)
    }

    const handleCommunicationSubmit = (communicationData) => {
        setFormData(prev => ({
            ...prev,
            communication: communicationData
        }))
        setCurrentStep(4)
    }
    
    const handlePreviewSubmit = () => {
        setCurrentStep(5)
    }

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1)
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <EventBasicInfo 
                    onSubmit={handleBasicInfoSubmit} 
                    initialData={formData.basicInfo}
                />
            case 2:
                return <EventFields 
                    onSubmit={handleFieldsSubmit}
                    onPrevious={handlePrevious}
                    initialData={formData.fields}
                />
            case 3:
                return <CommunicationMethods 
                    onSubmit={handleCommunicationSubmit}
                    onPrevious={handlePrevious}
                    formData={formData}
                />
            case 4:
                return <EventPreview 
                    formData={formData}
                    onSubmit={handlePreviewSubmit}
                    onPrevious={handlePrevious}
                />
            case 5:
                return <EventConfirmation  onRefresh={onRefresh}/>
            default:
                return null
        }
    }

    return (
        <div className="md:p-6">
            <ol className="flex flex-col-2  gap-1 sm:flex-row flex-wrap sm:flex-nowrap px-4 sm:px-0 items-start sm:items-center w-full text-sm sm:text-base text-gray-500 font-medium mb-12">
                <li className={`flex md:w-full items-center ${currentStep === 1 ? 'text-indigo-600' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
                        <span className={`w-6 h-6 ${currentStep === 1 ? 'bg-indigo-600' : currentStep > 1 ? 'bg-green-500' : 'bg-gray-100'} border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm ${currentStep === 1 ? 'text-white' : currentStep > 1 ? 'text-white' : 'text-gray-600'} lg:w-10 lg:h-10`}>
                            {currentStep > 1 ? '✓' : '1'}
                        </span>
                        Basic Info
                    </div>
                </li>
                <li className={`flex md:w-full items-center ${currentStep === 2 ? 'text-indigo-600' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
                        <span className={`w-6 h-6 ${currentStep === 2 ? 'bg-indigo-600' : currentStep > 2 ? 'bg-green-500' : 'bg-gray-100'} border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm ${currentStep === 2 ? 'text-white' : currentStep > 2 ? 'text-white' : 'text-gray-600'} lg:w-10 lg:h-10`}>
                            {currentStep > 2 ? '✓' : '2'}
                        </span>
                        Event Fields
                    </div>
                </li>
                <li className={`flex md:w-full items-center ${currentStep === 3 ? 'text-indigo-600' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
                        <span className={`w-6 h-6 ${currentStep === 3 ? 'bg-indigo-600' : currentStep > 3 ? 'bg-green-500' : 'bg-gray-100'} border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm ${currentStep === 3 ? 'text-white' : currentStep > 3 ? 'text-white' : 'text-gray-600'} lg:w-10 lg:h-10`}>
                            {currentStep > 3 ? '✓' : '3'}
                        </span>
                        Communication
                    </div>
                </li>
                <li className={`flex md:w-full items-center ${currentStep === 4 ? 'text-indigo-600' : 'text-gray-600'} sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-4 xl:after:mx-8`}>
                    <div className="flex items-center whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2">
                        <span className={`w-6 h-6 ${currentStep === 4 ? 'bg-indigo-600' : currentStep > 4 ? 'bg-green-500' : 'bg-gray-100'} border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm ${currentStep === 4 ? 'text-white' : currentStep > 4 ? 'text-white' : 'text-gray-600'} lg:w-10 lg:h-10`}>
                            {currentStep > 4 ? '✓' : '4'}
                        </span>
                        Preview
                    </div>
                </li>
                <li className={`flex items-center ${currentStep === 5 ? 'text-indigo-600' : 'text-gray-600'}`}>
                    <div className="flex items-center">
                        <span className={`w-6 h-6 ${currentStep === 5 ? 'bg-indigo-600' : 'bg-gray-100'} border border-gray-200 rounded-full flex justify-center items-center mr-3 text-sm ${currentStep === 5 ? 'text-white' : 'text-gray-600'} lg:w-10 lg:h-10`}>5</span>
                        Confirmation
                    </div>
                </li>
            </ol>

            {renderStep()}
        </div>
    )
}

export default CreateNewEvent