import React, { useState } from 'react'
import Credentials from './Credentials'
import CreateNewCredentials from './CreateNewCredentials';
import { useNavigate } from 'react-router-dom';

export default function CredentialSection() {
    const [currentView, setCurrentView] = useState("display")
    const navigate = useNavigate();
    // Handle navigation between event views
    const toggleEventView = () => {
        if (currentView === "viewCredential") {
            setCurrentView("display");
            navigate(`/dashboard?tab=credentials`);
        } else {
            const newView = currentView === "display" ? "create" : "display";
            setCurrentView(newView);
            navigate(`/dashboard?tab=credentials&view=${newView}`);
        }
    }

    return (
        <div>
            {/* Button to toggle between views */}
            <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between mb-6">
                <h3 className="text-base font-semibold text-gray-900">
                    {currentView === "create" ? "Create New Credential" :
                        currentView === "viewCredential" ? "View Event Details" : "Credentials List"}
                </h3>
                <div className="mt-3 sm:mt-0 sm:ml-4">
                    <button
                        type="button"
                        onClick={toggleEventView}
                        className="inline-flex items-center rounded-2xl bg-emerald-700 px-3 py-2 text-md font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {currentView === "display" ? "Create New Credential" :
                            currentView === "viewCredential" ? "Back to Credentials" : "Display All Credentials"}
                    </button>
                </div>
            </div>


            {/* Render the appropriate component based on the currentView */}
            {currentView === "create" ? (
                <CreateNewCredentials />
            ) : (
                <Credentials />
            )
            }
        </div>
    )
}
