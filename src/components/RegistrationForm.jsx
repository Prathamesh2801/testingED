import Input from './Input'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchEvents, registerEvent } from '../utils/EventFetchApi'


export default function RegistrationForm() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const [eventData, setEventData] = useState(null)
    const [formData, setFormData] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function displayEvents() {
            try {
                const data = await fetchEvents(eventId);
                setEventData(data.Data);
                
                // Initialize form data with empty values for all fields
                const initialFormData = {};
                data.Data.fields.forEach(field => {
                    initialFormData[field.name] = '';
                });
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to load event data');
            }
        }
        displayEvents();
    }, [eventId])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Validate required fields before submission
        const missingFields = eventData.fields
            .filter(field => {
                if (field.required) {
                    if (field.name === 'Profile_Picture') {
                        return !formData[field.name] || !(formData[field.name] instanceof File);
                    }
                    return !formData[field.name];
                }
                return false;
            })
            .map(field => field.name);

        if (missingFields.length > 0) {
            setError(`Required fields missing: ${missingFields.join(', ')}`);
            setLoading(false);
            return;
        }

        try {
            const response = await registerEvent(eventId, formData);
            console.log('Registration response:', response);
            
            if (response?.Data?.User_ID) {
                navigate(`/success/${response.Data.User_ID}`, {
                    state: {
                        registrationNumber: response.Data.Registration_Number,
                        qrPath: response.Data.QR_Path,
                        eventName: eventData.event.Event_Name
                    }
                });
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError(error.message);
            console.error('Registration error:', error);
        } finally {
            setLoading(false);
        }
    }

    if (!eventData) return <div>Loading...</div>

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h2 className="text-xl font-bold">{eventData.event.Event_Name}</h2>
                        {error && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                {error}
                            </div>
                        )}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            {eventData.fields.map((field) => (
                                <Input 
                                    key={field.name} 
                                    field={field}
                                    value={formData[field.name] || ''}
                                    onChange={handleInputChange}
                                />
                            ))}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                {loading ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
