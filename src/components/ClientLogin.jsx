import { useEffect, useState } from "react";
import { fetchEvents, authLogin } from "../utils/EventFetchApi";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

export default function ClientLogin() {
    const [logo, setLogo] = useState('');
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { eventId } = useParams();
    const navigate = useNavigate();
   
    useEffect(() => {
        async function fetchEventDetail() {
            try {
                const response = await fetchEvents(eventId);
                console.log("API Response:", response);
                if (response && response.Data && response.Data.event) {
                    setLogo(response.Data.event.Event_Logo);
                    localStorage.setItem('clientLogo', response.Data.event.Event_Logo);
                } else {
                    console.error("Invalid response structure:", response);
                    setError(true);
                    setErrorMessage("Event not found");
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
                setError(true);
                setErrorMessage("Error loading event details");
            }
        }
        
        if (eventId) {
            fetchEventDetail();
        } else {
            setError(true);
            setErrorMessage("No event ID provided");
        }
    }, [eventId]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Create credentials object for login
            const credentials = new URLSearchParams();
            credentials.append('username', username);
            credentials.append('password', password);
            credentials.append('event_id', eventId);
            
            const response = await authLogin(credentials);
            
            console.log("Login successful:", response);
            
             navigate('/clientDashboard'); 
            
        } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage(error.message || "Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

   
    return (
        <>{
            !error ? (
                <div className="flex min-h-screen flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-300">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        {logo && <img
                            alt="Your Company"
                            src={`${API_BASE_URL}/uploads/event_logos/${logo}`}
                            className="mx-auto h-20 w-auto"
                        />}
                        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
                            {errorMessage && (
                                <div className="mb-4 p-3 text-sm rounded bg-red-100 text-red-700">
                                    {errorMessage}
                                </div>
                            )}
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            autoComplete="username"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                        Password
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400"
                                    >
                                        {isLoading ? "Signing in..." : "Sign in"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <ErrorPage title="Event Not Found" status={404} msg={errorMessage || "Please check your URL"} />
            )
        }
        </>
    );
}