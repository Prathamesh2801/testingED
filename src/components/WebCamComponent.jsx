import { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamComponent = () => {
    const webcamRef = useRef(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);

    // Check if geolocation is available when component mounts
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
        }
    }, []);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setImageSrc(imageSrc);
            setLoading(true);
            getLocation();
        }
    }, [webcamRef]);

    const getLocation = () => {
        setLocationLoading(true);
        setError(''); // Clear previous errors
        
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLocationLoading(false);
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLocationLoading(false);
                setLoading(false);
            },
            (geoError) => {
                switch (geoError.code) {
                    case 1: // PERMISSION_DENIED
                        setError("Please allow location access in your browser settings");
                        break;
                    case 2: // POSITION_UNAVAILABLE
                        setError("Location information unavailable");
                        break;
                    case 3: // TIMEOUT
                        setError("Location request timed out");
                        break;
                    default:
                        setError("An unknown error occurred while retrieving location");
                }
                setLocationLoading(false);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000, // Increased timeout
                maximumAge: 0
            }
        );
    };

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user"
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column - Webcam */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="rounded w-full"
                        />
                    </div>
                    <button 
                        onClick={capture} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 disabled:bg-blue-300"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Capture Photo'}
                    </button>
                </div>

                {/* Right column - Captured Image with Overlay */}
                <div className="flex flex-col items-center gap-4">
                    {imageSrc ? (
                        <div className="relative">
                            <img 
                                src={imageSrc} 
                                alt="Captured" 
                                className="rounded shadow-md w-full"
                            />
                            {locationLoading && (
                                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded">
                                    Getting location...
                                </div>
                            )}
                            {location.lat && location.lon && (
                                <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white font-semibold p-4 rounded">
                                    <div className="flex flex-col items-start space-y-1">
                                        <p className="text-sm">
                                            <span className="font-semibold">Lat:</span> {location.lat.toFixed(6)}
                                        </p>
                                        <p className="text-sm">
                                            <span className="font-semibold">Long:</span> {location.lon.toFixed(6)}
                                        </p>
                                        <a 
                                            href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-300 hover:text-blue-200 underline"
                                        >
                                            View on Maps
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-gray-200 rounded-lg shadow-inner flex items-center justify-center w-full h-64">
                            <p className="text-gray-500">No image captured yet</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 bg-red-50 p-4 rounded w-full text-center border border-red-200">
                            {error}
                        </div>
                    )}
                </div>
                
                {/* Debug section */}
                <div className="col-span-1 md:col-span-2 mt-4">
                    <details className="bg-white p-4 rounded-lg shadow-sm">
                        <summary className="font-medium text-blue-600 cursor-pointer">Location Debug Info</summary>
                        <div className="mt-2 text-sm font-mono">
                            <p>Location State: {JSON.stringify(location)}</p>
                            <p>Location Loading: {locationLoading ? 'true' : 'false'}</p>
                            <p>Last Error: {error || 'None'}</p>
                            <button 
                                onClick={getLocation}
                                className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm"
                                disabled={locationLoading}
                            >
                                Retry Location
                            </button>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default WebcamComponent;