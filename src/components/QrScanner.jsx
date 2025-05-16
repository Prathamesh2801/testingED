import { useState, useEffect } from "react"
import  QrScanner  from "react-qr-scanner"
import { Camera, CameraOff, Check, X, RefreshCw } from "lucide-react"
import { userScanner } from "../utils/ClientData"

export default function QRScanner() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(true)
  const [scannerResponse,setScannerResponse] = useState('')
  const [cameraPermission, setCameraPermission] = useState("prompt")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for camera permissions
    if (navigator.permissions) {
      navigator.permissions.query({ name: "camera" }).then((permissionStatus) => {
        setCameraPermission(permissionStatus.state)
        permissionStatus.onchange = () => {
          setCameraPermission(permissionStatus.state)
        }
      })
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleScan = (data) => {
    if (data) {
      setResult(data.text)
      setScanning(false)
      // Here you would call your authorization API with the QR code data
      // Example: checkAuthorization(data.text);
      checkAuthorization(data.text)
    }
  }

  const handleError = (err) => {
    console.error(err)
    setError("Error accessing camera. Please check permissions.")
  }

  const resetScanner = () => {
    setResult(null)
    setError(null)
    setScanning(true)
  }

  // Mock function for future API integration
   const checkAuthorization = async (qrData) => {
    const response = await userScanner(qrData);
    setScannerResponse(response.Message);
    console.log("Checking Response ",response)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Camera className="mr-2" /> QR Code Scanner
          </h2>
          <p className="text-sm opacity-80">Scan a QR code to verify authorization</p>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <RefreshCw className="animate-spin text-indigo-600 h-8 w-8 mb-4" />
              <p className="text-gray-600">Initializing camera...</p>
            </div>
          ) : cameraPermission === "denied" ? (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <CameraOff className="mx-auto text-red-500 h-10 w-10 mb-2" />
              <h3 className="font-medium text-red-800">Camera access denied</h3>
              <p className="text-sm text-red-600 mt-1">
                Please enable camera access in your browser settings to scan QR codes.
              </p>
            </div>
          ) : scanning && !error ? (
            <div className="relative">
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden p-5 rounded-lg relative">
                <QrScanner
                  onScan={handleScan}
                  onError={handleError}
                  style={{ width: "100%" ,height:'100%',objectFit:'cover',borderRadius:'20px'}}
                  constraints={{
                    video: { facingMode: "environment" },
                  }}
                />
                <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-indigo-500 rounded-br-lg"></div>
                </div>
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                Position the QR code within the frame to scan
              </div>
            </div>
          ) : null}

          {error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={resetScanner}
                className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Try Again
              </button>
            </div>
          )}

          {result && (
            <div className="mt-4">
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <h3 className="font-medium text-green-800">QR Code Scanned</h3>
                    <p className="text-sm text-green-600 mt-1 break-all">{result}</p>
                  </div>
                </div>
              </div>

              {/* This section will be replaced with your actual authorization check */}
              <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                <h3 className="font-medium text-indigo-800">Authorization Status</h3>
                <p className="text-sm text-indigo-600 mt-1">{scannerResponse}</p>
              </div>

              <button
                onClick={resetScanner}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Scan Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
