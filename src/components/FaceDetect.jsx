import { useState, useEffect, useRef } from "react";
import {
  Camera,
  CameraOff,
  Check,
  X,
  RefreshCw,
  User,
  Zap,
} from "lucide-react";
import { faceDetection } from "../utils/FaceRegister";

export default function FaceDetect() {
  const eventID = localStorage.getItem("eventId");
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [detectionResponse, setDetectionResponse] = useState(null);
  const [cameraPermission, setCameraPermission] = useState("prompt");
  const [loading, setLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success"); // success, error
  const [toastMessage, setToastMessage] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Check for camera permissions
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" })
        .then((permissionStatus) => {
          setCameraPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setCameraPermission(permissionStatus.state);
          };
        });
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
      if (cameraPermission !== "denied") {
        startCamera();
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use front camera for face detection
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Error accessing camera. Please check permissions.");
      setCameraPermission("denied");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setPhoto(blob);
          setCapturing(false);
          stopCamera();
          // Automatically detect face after capture
          detectFace(blob);
        }
      },
      "image/jpeg",
      0.8
    );
  };

  const detectFace = async (photoBlob) => {
    if (!photoBlob) return;

    setIsDetecting(true);
    try {
      const response = await faceDetection({
        eventID: eventID,
        photo: photoBlob,
      });

      // if (!response || response.Status === undefined || response.Status === false) {
      //   throw new Error("Invalid response from server");
      // }
      setDetectionResponse(response);
      showToastMessage( response.Message, response.Status ? "success" : "error");
      console.log("Face detection response:", response);
    } catch (err) {
      console.error("Face detection failed:", err);
      setError(
        err.response.data.Message || "Face detection failed. Please try again."
      );
      showToastMessage(
        err.response.data.Message || "Face detection failed. Please try again.",
        "error"
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const showToastMessage = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const resetDetector = () => {
    setPhoto(null);
    setError(null);
    setDetectionResponse(null);
    setCapturing(false);
    setIsDetecting(false);
    startCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            toastType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center">
            {toastType === "success" ? (
              <Check className="h-5 w-5 mr-2" />
            ) : (
              <X className="h-5 w-5 mr-2" />
            )}
            {toastMessage}
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <h2 className="text-xl font-bold flex items-center">
            <User className="mr-2" /> Face Detection
          </h2>
          <p className="text-sm opacity-80">
            Capture your face for verification
          </p>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8">
              <RefreshCw className="animate-spin text-blue-600 h-8 w-8 mb-4" />
              <p className="text-gray-600">Initializing camera...</p>
            </div>
          ) : cameraPermission === "denied" ? (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <CameraOff className="mx-auto text-red-500 h-10 w-10 mb-2" />
              <h3 className="font-medium text-red-800">Camera access denied</h3>
              <p className="text-sm text-red-600 mt-1">
                Please enable camera access in your browser settings for face
                detection.
              </p>
            </div>
          ) : !photo ? (
            <div className="relative">
              <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg relative bg-gray-100">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover rounded-lg"
                  style={{ transform: "scaleX(-1)" }} // Mirror effect for front camera
                />

                {/* Face detection overlay */}
                <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-56 border-2 border-blue-400 rounded-full opacity-50"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>

              <div className="text-center mt-4 text-sm text-gray-600">
                Position your face within the frame and click capture
              </div>

              <button
                onClick={capturePhoto}
                disabled={capturing}
                className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Camera className="mr-2 h-5 w-5" />
                {capturing ? "Capturing..." : "Capture Photo"}
              </button>
            </div>
          ) : null}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {error && (
            <div className="bg-red-50 p-4 rounded-lg mt-4">
              <div className="flex">
                <X className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {photo && (
            <div className="mt-4">
              {isDetecting && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <Zap className="animate-pulse h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <h3 className="font-medium text-blue-800">
                        Detecting Face...
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Please wait while we process your image
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {detectionResponse && (
                <div className="space-y-4">
                  {/* Detection Status */}
                  <div className={`${
                        detectionResponse.Status
                          ? "bg-green-50"
                          : "bg-red-50"
                      } p-4 rounded-lg`}>
                    <h3
                      className={`font-medium ${
                        detectionResponse.Status
                          ? "text-green-800"
                          : "text-red-800"
                      } flex items-center`}
                    >
                    {  detectionResponse.Status ? <Check className="h-5 w-5 mr-2" /> : <X className="h-5 w-5 mr-2" />}
                      Face Detection Results
                    </h3>
                    <p className={`text-sm ${
                        detectionResponse.Status
                          ? "text-green-800"
                          : "text-red-800"
                      } mt-1`}>
                      {detectionResponse.Message}
                    </p>
                  </div>

                  {/* Detection Data */}
                  {/* {detectionResponse.Data && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-800">
                        Detection Details
                      </h3>
                      <div className="text-sm text-blue-600 mt-2 space-y-1">
                        <p>
                          <span className="font-medium">Confidence:</span>{" "}
                          {detectionResponse.Data.confidence?.toFixed(2)}%
                        </p>
                        <p>
                          <span className="font-medium">Face Index:</span>{" "}
                          {detectionResponse.Data.face_index}
                        </p>
                        {detectionResponse.Data.match_file && (
                          <p>
                            <span className="font-medium">Match File:</span>{" "}
                            {detectionResponse.Data.match_file}
                          </p>
                        )}
                      </div>
                    </div>
                  )} */}

                  {/* User Data */}
                  {detectionResponse.User_Data && (
                    <div className="bg-indigo-50 p-4 rounded-lg ">
                      <h3 className="font-medium text-indigo-800">
                        User Information
                      </h3>
                      <div className="text-sm text-indigo-600 mt-2 space-y-1">
                        <p>
                          <span className="font-medium">Name:</span>{" "}
                          {detectionResponse.User_Data.name}
                        </p>
                        <p>
                          <span className="font-medium">
                            Registration Number:
                          </span>{" "}
                          {detectionResponse.User_Data.Registration_Number}
                        </p>
                        <p className="wrap-break-word">
                          <span className="font-medium ">User ID:</span>{" "}
                          {detectionResponse.User_Data.User_ID}
                        </p>
                        <p>
                          <span className="font-medium">Status:</span>
                          <span
                            className={`ml-1 px-2 py-1 rounded text-xs ${
                              detectionResponse.User_Data.Scanned
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {detectionResponse.User_Data.Scanned
                              ? "Scanned"
                              : "Not Scanned"}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex  mt-4">
                <button
                  onClick={resetDetector}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Detect Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
