"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Logo from "../assets/img/logo.png"
import Done from "../assets/vid/Done.gif"
import Confetti from "../assets/vid/Confetti.gif"
import QrCode from "../assets/img/qrcode.jpg"
import DownloadIcon from "../assets/vid/download.gif"
import { fetchEvents, registerEvent } from "../utils/EventFetchApi"
import { API_BASE_URL } from "../config"

// Main component that manages screen state
export default function EventRegistrationTemp() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [currentScreen, setCurrentScreen] = useState("register")
  const [formData, setFormData] = useState({})
  const [eventData, setEventData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)

  // Fetch event data on component mount
  useEffect(() => {
    async function loadEventData() {
      try {
        const data = await fetchEvents(eventId)
        setEventData(data.Data)

        // Initialize form data with empty values for all fields
        const initialFormData = {}
        data.Data.fields.forEach((field) => {
          initialFormData[field.name] = ""
        })
        setFormData(initialFormData)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError("Failed to load event data")
      }
    }

    if (eventId) {
      loadEventData()
    }
  }, [eventId])

  // Navigation functions
  const goToLoading = () => setCurrentScreen("loading")
  const goToSuccess = () => setCurrentScreen("success")
  const goToDownload = () => setCurrentScreen("download")
  const goToError = () => setCurrentScreen("error")
  const goToRegister = () => setCurrentScreen("register")

  // Render the appropriate screen based on state
  return (
    <div className="flex min-h-screen flex-col items-center pt-28 bg-gradient-to-b from-[#f8b7c1] to-[#d8b7e0] p-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        {currentScreen === "register" && (
          <RegisterScreen
            formData={formData}
            setFormData={setFormData}
            onSubmit={goToLoading}
            eventData={eventData}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            goToLoading={goToLoading}
            setRegistrationData={setRegistrationData}
            goToSuccess={goToSuccess}
            goToError={goToError}
            eventId={eventId}
          />
        )}
        {currentScreen === "loading" && (
          <LoadingScreen 
            onComplete={goToSuccess} 
            eventData={eventData} // Pass eventData as prop
          />
        )}
        {currentScreen === "success" && (
          <SuccessScreen
            onHomeClick={goToRegister}
            onDownloadClick={goToDownload}
            registrationData={registrationData}
            eventData={eventData}
          />
        )}
        {currentScreen === "download" && <DownloadScreen onComplete={goToRegister} />}
        {currentScreen === "error" && <ErrorScreen onHomeClick={goToRegister} errorMessage={error} />}
      </div>
    </div>
  )
}

// Input Component
function InputField({ field, value, onChange }) {
  const getInputType = (sqlType) => {
    if (field.name === "Profile_Picture") return "file"
    if (sqlType.includes("varchar")) return "text"
    if (sqlType.includes("bigint")) return "number"
    if (sqlType.includes("enum")) return "select"
    return "text"
  }

  const getEnumValues = (type) => {
    if (!type.includes("enum")) return []
    return type
      .replace("enum(", "")
      .replace(")", "")
      .split(",")
      .map((val) => val.replace(/'/g, "").trim())
  }

  const inputType = getInputType(field.type)
  const enumValues = getEnumValues(field.type)

  const handleFileChange = (e) => {
    onChange({
      target: {
        name: field.name,
        value: e.target.files[0],
      },
    })
  }

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block mb-2 text-sm font-medium text-gray-900">
        {field.name.replace(/_/g, " ")}
        {field.required && <span className="text-red-500">*</span>}
      </label>

      {inputType === "file" ? (
        <input
          type="file"
          accept="image/*"
          name={field.name}
          id={field.name}
          onChange={handleFileChange}
          className="w-full px-3 py-2 shrink-0 border bg-white rounded-[5px] border-solid border-[#5B5959]"
          required={field.required}
        />
      ) : inputType === "select" ? (
        <select
          name={field.name}
          id={field.name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2 shrink-0 border bg-white rounded-[5px] border-solid border-[#5B5959]"
          required={field.required}
        >
          <option value="">Select {field.name}</option>
          {enumValues.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={inputType}
          name={field.name}
          id={field.name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2 shrink-0 border bg-white rounded-[5px] border-solid border-[#5B5959]"
          placeholder={`Enter your ${field.name.toLowerCase()}`}
          required={field.required}
        />
      )}
    </div>
  )
}

// Registration Screen
function RegisterScreen({
  formData,
  setFormData,
  onSubmit,
  eventData,
  error,
  setError,
  loading,
  setLoading,
  setRegistrationData,
  goToSuccess,
  goToLoading,
  goToError,
  eventId,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!eventData) {
      setError("Event data not loaded")
      setLoading(false)
      return
    }

    // Validate required fields
    const missingFields = eventData.fields
      .filter((field) => {
        if (field.required) {
          if (field.name === "Profile_Picture") {
            return !formData[field.name] || !(formData[field.name] instanceof File)
          }
          return !formData[field.name]
        }
        return false
      })
      .map((field) => field.name)

    if (missingFields.length > 0) {
      setError(`Required fields missing: ${missingFields.join(", ")}`)
      setLoading(false)
      return
    }

    try {
      const response = await registerEvent(eventId, formData);
      console.log("Registration response:", response);

      if (response?.Data?.User_ID) {
        const isQREnabled = eventData?.event?.IsQRCode === "1";

        setRegistrationData({
          userId: response.Data.User_ID,
          registrationNumber: response.Data.Registration_Number,
          qrPath: response.Data.QR_Path || null,
          eventName: eventData.event.Event_Name,
        });

        // Always go to loading screen first
        goToLoading();
        
        // If QR is not enabled, don't proceed to success screen
        if (!isQREnabled) {
          setLoading(true); // Keep loading state
          return; // Don't proceed further
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
      console.error("Registration error:", error);
      goToError();
    } finally {
      setLoading(false);
    }
  }

  if (!eventData) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-4 border-[#f9a825] rounded-full animate-spin mb-4"></div>
        <p className="text-white">Loading event data...</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <img alt="Company Logo" src={Logo || "/placeholder.svg"} className="h-28 w-28" />
      </div>

      <h1 className="text-2xl font-bold text-black mb-1">{eventData?.event?.Event_Name || "Event Name"}</h1>
      <p className="text-white text-lg mb-6">Create an account</p>

      {error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div
        className="w-full border border-white backdrop-blur-sm rounded-lg p-6"
        style={{
          backgroundImage: "linear-gradient(to bottom, #FEB2B4, #D4AFE0)",
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {eventData?.fields?.map((field) => (
            <InputField key={field.name} field={field} value={formData[field.name] || ""} onChange={handleChange} />
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f9a825] hover:bg-[#f57f17] text-white font-medium py-2 rounded-md transition-colors"
          >
            {loading ? "Submitting..." : "Register"}
          </button>
        </form>
      </div>
    </>
  )
}

// Loading Screen
function LoadingScreen({ onComplete, eventData }) { // Remove useContext, add eventData prop
  useEffect(() => {
    // Only set timer if QR code is enabled
    if (eventData?.event?.IsQRCode === "1") {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onComplete, eventData]);

  return (
    <>
      <div className="w-72 h-72 mb-6 relative">
        <img src={Done || "/placeholder.svg"} alt="Done animation" className="w-full h-full" />
      </div>

      <h2 className="text-white text-2xl font-medium text-center mb-12">
        You're in! Thank you for registering
      </h2>

      {/* Only show home button if QR is not enabled */}
      {eventData?.event?.IsQRCode !== "1" && (
        <button
          onClick={() => window.location.reload()}
          className="bg-[#f9a825] hover:bg-[#f57f17] text-white font-medium py-2 px-8 rounded-md transition-colors"
        >
          Register Another
        </button>
      )}
    </>
  )
}

// Success Screen
function SuccessScreen({ onHomeClick, onDownloadClick, registrationData, eventData }) {
  // Check if QR code is enabled for this event
  const isQREnabled = eventData?.event?.IsQRCode === "1";
  
  // Construct full QR code URL
  const qrCodeUrl = registrationData?.qrPath ? 
    `${API_BASE_URL}/uploads/qrcodes/${eventData.event.Event_ID}/${registrationData.qrPath}` : null;

  return (
    <>
      <h2 className="text-white text-2xl font-medium text-center mb-8">
        You're in! Thank you for registering
      </h2>

      {registrationData && (
        <div className="bg-white p-4 rounded-md mb-4 text-center">
          <p className="font-medium text-gray-800">
            Registration #{registrationData.registrationNumber}
          </p>
          <p className="text-sm text-gray-600">{registrationData.eventName}</p>
        </div>
      )}

      {isQREnabled ? (
        qrCodeUrl ? (
          <div className="bg-white p-4 rounded-md mb-12">
            <img 
              src={qrCodeUrl}
              alt="QR Code"
              className="w-full h-full object-contain"
              onError={(e) => {
                console.error('QR Code loading failed');
                e.target.src = QrCode; // Fallback to default QR code image
              }}
            />
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-8 text-white text-center">
            <p>QR code generation is temporarily unavailable.</p>
            <p className="text-sm mt-2">Please keep your registration number for reference.</p>
          </div>
        )
      ) : null}

      <div className="flex space-x-4">
        <button
          onClick={onHomeClick}
          className="bg-[#f9a825] hover:bg-[#f57f17] text-white font-medium py-2 px-8 rounded-md transition-colors"
        >
          HOME
        </button>

        {isQREnabled && qrCodeUrl && (
          <button
            onClick={() => {
              // Download QR code
              window.open(qrCodeUrl, '_blank');
            }}
            className="bg-[#f9a825] hover:bg-[#f57f17] text-white font-medium py-2 px-8 rounded-md transition-colors"
          >
            Download
          </button>
        )}
      </div>
    </>
  )
}

// Download Screen
function DownloadScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 5000) // Extended time to show confetti animation

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <>
      <div className="relative mb-6">
        {/* Confetti animation overlay */}
        <div className="fixed inset-0 pointer-events-none">
          <img src={Confetti || "/placeholder.svg"} alt="Confetti animation" className="w-full h-full object-cover" />
        </div>

        {/* Download icon */}
        <div className="relative z-20 mt-20">
          <img src={DownloadIcon || "/placeholder.svg"} alt="Download animation" className="w-40 h-40" />
        </div>
      </div>

      <div className="w-64 h-2 bg-[#0066ff]/30 rounded-full mb-12">
        <div
          className="h-full bg-[#0066ff] rounded-full"
          style={{
            width: "100%",
            animation: "progress 2.5s ease-in-out",
          }}
        ></div>
      </div>

      <h2 className="text-white text-xl font-medium text-center">Your ticket is being downloaded</h2>
    </>
  )
}

// Error Screen
function ErrorScreen({ onHomeClick, errorMessage }) {
  return (
    <>
      <h2 className="text-white text-2xl font-medium text-center mb-6">Oops — Registration Failed</h2>

      {errorMessage && (
        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-8 text-white">
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        onClick={onHomeClick}
        className="bg-[#f9a825] hover:bg-[#f57f17] text-white font-medium py-2 px-8 rounded-md transition-colors"
      >
        Try Again
      </button>
    </>
  )
}

// CSS for animations
const styles = `
@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
`
