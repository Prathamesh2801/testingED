"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import { fetchEvents, registerEvent } from "../utils/EventFetchApi"
import { API_BASE_URL, gradientThemes } from "../config"
import done from "../assets/vid/light_done.gif"
import download from "../assets/vid/light_download.gif"
import confetti from "../assets/vid/Confetti.gif"
import canceled from "../assets/vid/Canceled.gif"
import Webcam from "react-webcam"
import { toast, Toaster } from 'react-hot-toast';

// Modal component for camera consent
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-blue-600 p-4">
          <h3 className="text-lg font-medium text-white">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Main component that manages screen state
export default function RegistrationForm() {
  const { eventId } = useParams()
  const [currentScreen, setCurrentScreen] = useState("register")
  const [formData, setFormData] = useState({})
  const [eventData, setEventData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [registrationData, setRegistrationData] = useState(null)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [showSkipModal, setShowSkipModal] = useState(false)



  // Fetch event data on component mount
  useEffect(() => {
    async function loadEventData() {
      try {
        const data = await fetchEvents(eventId)
        setEventData(data.Data)
        console.log("Event data:", data.Data)
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
  const goToFaceRec = () => setCurrentScreen("faceRec")
  const goToDownload = () => setCurrentScreen("download")
  const goToError = () => setCurrentScreen("error")
  const goToRegister = () => setCurrentScreen("register")

  // Handles user's decision about camera access
  const handleCameraDecision = (consent) => {
    setShowCameraModal(false)

    if (consent) {
      // User agreed to use camera
      toast.success('Camera access allowed', {
        duration: 3000,
        position: 'top-center'
      })
      goToFaceRec()
    } else {
      // User declined camera access
      setShowSkipModal(true)
    }
  }

  // Handles user's decision after declining camera
  const handleSkipDecision = async (reconsider) => {
    setShowSkipModal(false)

    if (reconsider) {
      // User decided to reconsider using camera
      setShowCameraModal(true)
    } else {
      // User confirmed to proceed without facial recognition
      toast.success('Proceeding without facial recognition', {
        duration: 3000,
        position: 'top-center'
      })

      // Submit registration without facial recognition
      try {
        setLoading(true)
        const response = await registerEvent(eventId, formData)
        console.log("Registration response:", response)

        if (response?.Data?.User_ID) {
          const isQREnabled = eventData?.event?.IsQRCode === "1"

          setRegistrationData({
            userId: response.Data.User_ID,
            registrationNumber: response.Data.Registration_Number,
            qrPath: response.Data.QR_Path || null,
            eventName: eventData.event.Event_Name,
          })

          goToLoading()
        } else {
          throw new Error("Invalid response format")
        }
      } catch (error) {
        setError(error.response?.data?.Message || "Registration failed. Please try again.")
        console.error("Registration error:", error)
        goToError()
      } finally {
        setLoading(false)
      }
    }
  }


  

  const mobileImgURL  = eventData?.event.image1
    ? `${API_BASE_URL}/${eventData.event.image1}`
    : null;
  const tabletImgURL  = eventData?.event.image2
    ? `${API_BASE_URL}/${eventData.event.image2}`
    : null;
  const desktopImgURL = eventData?.event.image3
    ? `${API_BASE_URL}/${eventData.event.image3}`
    : null;

  let bgClasses = "bg-center bg-cover bg-no-repeat";
  bgClasses += mobileImgURL
    ? ` bg-[url('${mobileImgURL}')]`
    : " bg-gradient-to-r from-blue-900 via-blue-800 to-blue-500";
  if (tabletImgURL) bgClasses += ` md:bg-[url('${tabletImgURL}')]`;
  if (desktopImgURL) bgClasses += ` lg:bg-[url('${desktopImgURL}')]`;
  
  return (
    <div className={`flex min-h-screen flex-col items-center pt-8 p-4 relative bg-page-bg ${bgClasses}`}>
      {/* Dynamic background style */}
      {/* <style dangerouslySetInnerHTML={getBackgroundStyle()} /> */}
      
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0"></div>
      
      <Toaster />

      <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        {currentScreen === "register" && (
          <RegisterScreen
            formData={formData}
            setFormData={setFormData}
            eventData={eventData}
            error={error}
            setError={setError}
            loading={loading}
            setLoading={setLoading}
            setRegistrationData={setRegistrationData}
            goToSuccess={goToSuccess}
            goToLoading={goToLoading}
            goToError={goToError}
            goToFaceRec={goToFaceRec}
            eventId={eventId}
            setShowCameraModal={setShowCameraModal}
          />
        )}
        {currentScreen === "loading" && (
          <LoadingScreen
            onComplete={goToSuccess}
            eventData={eventData}
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
        {currentScreen === "faceRec" && (
          <FaceRecScreen eventData={eventData} />
        )}
        {currentScreen === "download" && <DownloadScreen onComplete={goToRegister} />}
        {currentScreen === "error" && <ErrorScreen onHomeClick={goToRegister} errorMessage={error} />}
      </div>

      {/* Camera Consent Modal */}
      <Modal
        isOpen={showCameraModal}
        onClose={() => handleCameraDecision(false)}
        title="Camera Access Required"
      >
        <div className="text-center">
          <div className="mb-6 text-gray-700">
            <p className="mb-4">This event requires facial recognition for registration.</p>
            <p>Do you consent to allowing camera access for this purpose?</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleCameraDecision(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              No, Thanks
            </button>
            <button
              onClick={() => handleCameraDecision(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Yes, Allow Camera
            </button>
          </div>
        </div>
      </Modal>

      {/* Skip FaceRec Modal */}
      <Modal
        isOpen={showSkipModal}
        onClose={() => { }}
        title="Camera Access Declined"
      >
        <div className="text-center">
          <div className="mb-6 text-gray-700">
            <p className="mb-4">Without facial recognition, some event features may be limited.</p>
            <p>Would you like to proceed with registration anyway?</p>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleSkipDecision(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Continue Without Camera
            </button>
            <button
              onClick={() => handleSkipDecision(true)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            >
              Give Camera Permission
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Input Component
function InputField({ field, value, onChange }) {

  const getInputType = (sqlType) => {
    // Check if this is a file field based on multiple criteria
    if (
      field.isFile ||
      field.type.includes("file") ||
      field.name.toLowerCase().includes("poster") ||
      field.name.toLowerCase().includes("picture") ||
      field.name.toLowerCase().includes("image") ||
      (field.comment && field.comment.includes("file"))
    ) {
      return "file"
    }

    if (sqlType.includes("varchar")) return "text"
    if (sqlType.includes("bigint") || sqlType.includes("int")) return "number"
    if (sqlType.includes("enum")) return "select"
    return "text"
  }

  const getEnumValues = (type) => {
    if (!type.includes("enum")) return []
    try {
      return type
        .replace("enum(", "")
        .replace(")", "")
        .split(",")
        .map((val) => val.replace(/'/g, "").trim())
    } catch (error) {
      console.error("Error parsing enum values:", error)
      return []
    }
  }

  const inputType = getInputType(field.type)
  const enumValues = getEnumValues(field.type)

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block mb-2 text-sm font-medium text-white tracking-wide uppercase">
        {field.name.replace(/_/g, " ")}
        {field.required && <span className="text-red-500 mx-2">*</span>}
      </label>

      {inputType === "file" ? (
        <div className="flex flex-col gap-1">
          <input
            type="file"
            accept="image/*"
            name={field.name}
            id={field.name}
            onChange={onChange}
            className="w-full px-3 py-2 shrink-0 border bg-white rounded-[5px] border-solid border-[#5B5959]"
            required={field.required}
          />
          <p className="text-xs text-gray-300 tracking-wider mb-1">
            {field.allowedTypes?.join(', ').toUpperCase()} (MAX. {Math.round(field.maxSize / 1024)} KB)
          </p>

        </div>
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
          {enumValues.map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={inputType}
          name={field.name}
          id={field.name}
          value={value ?? ""}
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
  eventData,
  error,
  setError,
  loading,
  setLoading,
  setRegistrationData,
  goToSuccess,
  goToLoading,
  goToError,
  goToFaceRec,
  eventId,
  setShowCameraModal
}) {
  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!eventData) {
      setError("Event data not loaded")
      setLoading(false)
      return
    }

    console.log("Current form data:", formData);
    console.log("Face Status data:", eventData.event.IsFaceRec);

    // Check if facial recognition is required
    if (eventData.event.IsFaceRec === '1') {

      // Show camera consent modal instead of directly going to face rec
      setTimeout(() => {
        setLoading(false)
        setShowCameraModal(true)
      }, 1000);
      return;
    }

    // If no facial recognition required, proceed with normal registration
    try {
      const response = await registerEvent(eventId, formData)
      console.log("Registration response:", response)

      if (response?.Data?.User_ID) {
        const isQREnabled = eventData?.event?.IsQRCode === "1"

        setRegistrationData({
          userId: response.Data.User_ID,
          registrationNumber: response.Data.Registration_Number,
          qrPath: response.Data.QR_Path || null,
          eventName: eventData.event.Event_Name,
        })

        // Always go to loading screen first
        goToLoading()

        // If QR is not enabled, don't proceed to success screen
        if (!isQREnabled) {
          setLoading(true) // Keep loading state
          return // Don't proceed further
        }
      } else {
        throw new Error("Invalid response format")
      }
    } catch (error) {
      setError(error.response?.data?.Message || "Registration failed. Please try again.")
      console.error("Registration error:", error)
      goToError()
    } finally {
      setLoading(false)
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
        <img alt="Company Logo" src={`${API_BASE_URL}/uploads/event_logos/${eventData.event.Event_Logo}`} className="h-20 w-20 my-1 border-2 border-white rounded-full" />
      </div>

      <h1 className="text-4xl text-white mb-1 font-jersey-25 tracking-wider">{eventData?.event?.Event_Name || "Event Name"}</h1>
      <p className="text-white text-2xl tracking-wider mb-6 font-jersey-25">Create an account</p>

      {error && <div className="w-full p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

      <div
        className="w-full p-6 shrink-0 border border-white 
            shadow-[inset_12.867px_12.867px_12.867px_0_rgba(194,194,194,0.1),inset_-12.867px_12.867px_12.867px_0_rgba(255,255,255,0.1)] 
            backdrop-blur-[12.867px] 
            rounded-[30px]
            bg-opacity-60"
        style={{ background: "linear-gradient(to right, rgba(13, 71, 161, 0.7), rgba(21, 101, 192, 0.7), rgba(30, 136, 229, 0.7), rgba(66, 165, 245, 0.7))" }} 
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {eventData?.fields?.map((field) => (
            <InputField key={field.name} field={field} value={formData[field.name] || ""} onChange={handleChange} />
          ))}
          <div className="w-full flex flex-col items-center justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-10/12 border-2 border-solid bg-[#FFA60D] border-[#F39A00] rounded-[20px]
                shadow-[0_2px_3px_0_rgba(0,0,0,0.20),inset_-5px_5px_6px_0_rgba(255,255,255,0.74)]  
                hover:bg-[#FFC556] text-white font-medium py-2 transition-colors"
            >
              {loading ? "Submitting..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function FaceRecScreen({ eventData }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    setLoading(true);
    // TODO: call getLocation() or upload imageSrc here

    toast.success('Photo captured successfully!', {
      duration: 3000,
      position: 'top-center'
    });

    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">

      <img alt="Company Logo" src={`${API_BASE_URL}/uploads/event_logos/${eventData.event.Event_Logo}`} className="h-20 w-20 my-1 border-2 border-white rounded-full" />

      <h1 className="text-4xl text-white mb-1 font-jersey-25 tracking-wider">{eventData?.event?.Event_Name || "Event Name"}</h1>

      {/* Passport‑style webcam */}
      <div className="bg-white p-2 rounded-lg shadow-md">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="w-72 h-96 rounded object-cover"
        />
      </div>

      {/* Capture button */}
      <button
        type="button"
        onClick={capture}
        disabled={loading}
        className={`
          w-1/2 border-2 rounded-[20px] 
          bg-[#FFA60D] border-[#F39A00] 
          shadow-[0_2px_3px_0_rgba(0,0,0,0.20),
                  inset_-5px_5px_6px_0_rgba(255,255,255,0.74)]
          font-medium py-2 text-white transition-colors
          hover:bg-[#FFC556]
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? 'Processing…' : 'Capture Photo'}
      </button>
    </div>
  )
}

// Loading Screen
function LoadingScreen({ onComplete, eventData }) {
  useEffect(() => {
    // Only set timer if QR code is enabled
    if (eventData?.event?.IsQRCode === "1") {
      const timer = setTimeout(() => {
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [onComplete, eventData])

  return (
    <>
      <div className="w-96 h-96 mb-6 relative">
        <img src={done} alt="Done animation" className="w-full h-full" />
      </div>

      <h2 className="text-white text-2xl font-medium text-center mb-12">You're in! Thank you for registering</h2>

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
  const isQREnabled = eventData?.event?.IsQRCode === "1"

  // Construct full QR code URL
  const qrCodeUrl = registrationData?.qrPath
    ? `${API_BASE_URL}/${registrationData.qrPath}`
    : null

  const handleDownloadQRCode = async () => {
    if (!qrCodeUrl) return;
    try {
      // 1. Fetch the image as a blob
      const response = await fetch(qrCodeUrl, { mode: 'cors' });
      const blob = await response.blob();

      // 2. Create an object URL for the blob
      const objectUrl = window.URL.createObjectURL(blob);

      // 3. Build & click a hidden <a download> link
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `QR_${registrationData.registrationNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 4. Cleanup
      window.URL.revokeObjectURL(objectUrl);

      // 5. Navigate to your DownloadScreen
      onDownloadClick();
    } catch (err) {
      console.error("Failed to download QR code", err);
      toast.error("Failed to download QR code", {
        duration: 3000,
        position: 'top-center'
      });
    }
  };

  return (
    <>
      <h2 className="text-white text-2xl font-medium text-center mb-8">You're in! Thank you for registering</h2>

      {registrationData && (
        <div className="bg-white p-4 rounded-md mb-4 text-center">
          <p className="font-medium text-gray-800">Registration #{registrationData.registrationNumber}</p>
          <p className="text-sm text-gray-600">{registrationData.eventName}</p>
        </div>
      )}

      {isQREnabled ? (
        qrCodeUrl ? (
          <div className="bg-white p-4 rounded-md mb-12">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className="w-full h-full object-contain"
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
            onClick={handleDownloadQRCode}
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
    }, 10000) // Extended time to show confetti animation

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <>
      <div className="relative mb-6">
        {/* Confetti animation overlay */}
        <div className="fixed inset-0 pointer-events-none">
          <img src={confetti} alt="Confetti animation" className="w-full h-full object-cover" />
        </div>

        {/* Download icon */}
        <div className="relative z-20 mt-20">
          <img src={download} alt="Download animation" className="w-64 h-64" />
        </div>
      </div>

      <h2 className="text-white text-3xl tracking-wider font-jersey-25 text-center">Your ticket is being downloaded</h2>
    </>
  )
}

// Error Screen
function ErrorScreen({ onHomeClick, errorMessage }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] -mt-16 text-center ">
      <div className="w-auto h-40 mb-6 relative">
        <img src={canceled} alt="Invalid" className="w-full h-full" />
      </div>

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
    </div>
  )
}