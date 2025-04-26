import React, { useState } from 'react';

export default function GeoLocation() {
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const getLocation = () => {
        setLoading(true);
        setError('');

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                setLoading(false);
            },
            (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setError("Please allow location access");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setError("Location information unavailable");
                        break;
                    case error.TIMEOUT:
                        setError("Location request timed out");
                        break;
                    default:
                        setError("An unknown error occurred");
                }
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    return (
        <div className="p-6">
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={getLocation}
                disabled={loading}
            >
                {loading ? 'Getting Location...' : 'Get Current Location'}
            </button>

            {error && (
                <div className="mt-4 text-red-500">
                    {error}
                </div>
            )}

            {location.lat && location.lon && (
                <div className="mt-4">
                    <p className="text-lg"><strong>Latitude:</strong> {location.lat}</p>
                    <p className="text-lg"><strong>Longitude:</strong> {location.lon}</p>
                    <a 
                        href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 underline mt-2 inline-block"
                    >
                        View on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
}
