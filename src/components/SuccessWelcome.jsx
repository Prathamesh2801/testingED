import React from 'react'
import { useParams, useLocation } from 'react-router-dom'

function SuccessWelcome() {
    const { id } = useParams();
    const location = useLocation();
    const { registrationNumber, qrPath, eventName } = location.state || {};

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-green-600 mb-2">
                        Registration Successful!
                    </h2>
                    <p className="text-gray-600">
                        Thank you for registering for {eventName}
                    </p>
                </div>

                {qrPath && (
                    <div className="mb-6">
                        <img 
                            src={`http://192.168.1.12/Registration/${qrPath}`}
                            alt="QR Code"
                            className="mx-auto w-48 h-48"
                        />
                    </div>
                )}

                <div className="text-left mb-6">
                    <p className="text-gray-700 mb-2">
                        <span className="font-semibold">Registration ID:</span> {id}
                    </p>
                    {registrationNumber && (
                        <p className="text-gray-700">
                            <span className="font-semibold">Registration Number:</span> {registrationNumber}
                        </p>
                    )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Please save your registration details for future reference.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SuccessWelcome
