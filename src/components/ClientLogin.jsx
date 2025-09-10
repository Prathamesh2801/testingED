import { useEffect, useState } from "react";
import { fetchEvents, authLogin } from "../utils/EventFetchApi";
import { API_BASE_URL } from "../config";
import { useParams, useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import LoginBanner from "../assets/img/loginBanner3.png";
import { Eye, EyeOff, User2 } from "lucide-react";

export default function ClientLogin() {
  const [eventData, setEventData] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEventDetail() {
      try {
        const response = await fetchEvents(eventId);
        console.log("API Response:", response);
        if (response && response.Data && response.Data.event) {
          setEventData(response.Data.event);
          localStorage.setItem("clientLogo", response.Data.event.Event_Logo);
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
      credentials.append("username", username);
      credentials.append("password", password);
      credentials.append("event_id", eventId);

      const response = await authLogin(credentials);

      console.log("Login successful:", response);

      if (response.Role === "Client" || response.Role === "Admin") {
        navigate("/clientDashboard");
      } else if (response.Role === "Scanner") {
        navigate("/qrscan");
      }
      else if (response.Role === "faceDetect") {
        navigate("/faceDetect");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!error ? (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-50 to-emerald-300  opacity-80 -z-5"></div>

          <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative z-10">
            {/* Form Section */}
            <div className="w-full lg:w-1/2 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-center md:gap-12">
                  <img
                    src={`${API_BASE_URL}/uploads/event_logos/${eventData.Event_Logo}`}
                    alt=""
                    className="w-20 h-20 mb-8 rounded-full"
                  />
                  <h1 className="text-4xl text-gray-900 mb-8 font-jersey-25 tracking-wide text-center">
                    {eventData.Event_Name}
                  </h1>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                  Login
                </h4>
                <p className="text-gray-600 mb-6 text-center">
                  Please enter your credentials to access your account.
                </p>

                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-medium"
                    >
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        required
                        className="w-full p-3 bg-gray-50/80 backdrop-blur-sm border-2 border-gray-500 focus:border-none rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <User2 className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-gray-700 font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full p-3 bg-gray-50/80 backdrop-blur-sm  border-2 border-gray-500 focus:border-none  rounded-md text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 transition-all"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? (
                          <Eye className="h-5 w-5 text-gray-500 cursor-pointer" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 hidden lg:block">
              <img
                src={LoginBanner || "/placeholder.svg"}
                alt="Night sky with a person standing on a rock"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Mobile Image - Only visible on mobile */}
            <div className="w-full block lg:hidden">
              <img
                src={LoginBanner || "/placeholder.svg"}
                alt="Night sky with a person standing on a rock"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <ErrorPage
          title="Event Not Found"
          status={404}
          msg={errorMessage || "Please check your URL"}
        />
      )}
    </>
  );
}
