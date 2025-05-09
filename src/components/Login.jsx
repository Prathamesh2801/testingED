"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authLogin } from "../utils/EventFetchApi"
import { Eye, User2 } from "lucide-react"
import LoginBanner from "../assets/img/loginBanner3.png"
import Logo from "../assets/img/logo.png"

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await authLogin(user)

      if (response.Role === "Admin") {
        navigate("/dashboard")
      } else if (response.Role === "Client" && response.Event_ID) {
        navigate(`/eventForm/${response.Event_ID}`)
      } else {
        throw new Error("Invalid role or missing event ID")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

      {/* Gradient overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-50 to-emerald-300  opacity-80 -z-5"></div>

      <div className="w-full max-w-7xl bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl flex flex-col lg:flex-row relative z-10">
        {/* Form Section */}
           <div className="absolute top-0 left-0 w-full h-full"></div>
        <div className="w-full lg:w-1/2 p-8 lg:p-12 " >
          <div className="max-w-md mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-8">
              <img src={Logo || "/placeholder.svg"} alt="" className="w-20 h-20 mb-8 text-center" />
              <h1 className="text-4xl text-gray-900 mb-8 font-jersey-25 tracking-wide">Super Admin</h1>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-4 text-center">Login</h4>
            <p className="text-gray-600 mb-6 text-center">Please enter your credentials to access your account.</p>

            {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-gray-700 font-medium">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    required
                    className="w-full p-3 bg-gray-50/80 backdrop-blur-sm rounded-md border-2 border-gray-500 focus:border-none text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User2 className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="w-full p-3 bg-gray-50/80 backdrop-blur-sm rounded-md  border-2 border-gray-500 focus:border-none  text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Eye className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-md transition duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 hidden lg:block  " >
          <img
            src={LoginBanner || "/placeholder.svg"}
            alt="Night sky with a person standing on a rock"
            className="w-full h-full object-cover "
          />
        </div>
   

        {/* Mobile Image - Only visible on mobile */}
        <div className="w-full block lg:hidden p-5">
          <img
            src={LoginBanner || "/placeholder.svg"}
            alt="Night sky with a person standing on a rock"
            className="w-full h-auto object-cover rounded-3xl"
          />
        </div>
     


      </div>
    </div>
  )
}

export default Login
