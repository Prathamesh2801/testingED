import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm'
import WebcamComponent from './components/WebCamComponent'
import SuccessWelcome from './components/SuccessWelcome'
import DashBoard from './components/DashBoard'
import Login from './components/Login'
import GeoLocation from './components/GeoLocation'
import { ProtectedRoutes } from './routes/ProtectedRoutes'
import EventRegistrationTemp from './components/EventRegistrationTemp'
import { Toaster } from 'react-hot-toast'
import ClientDashboard from './components/ClientDashboard'
import ClientLogin from './components/ClientLogin'
import { ProtectedClientRoutes } from './routes/ProtectedClientRoutes'
import ErrorPage from './components/ErrorPage'

function App() {
  return (
    <HashRouter>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Routes>
        <Route path="/eventForm/:eventId" element={<RegistrationForm />} />
        <Route path="/upload" element={<WebcamComponent />} />
        <Route path="/success/:id" element={<SuccessWelcome />} />
        <Route path="/geolocation" element={<GeoLocation />} />
        <Route path="/temp/:eventId" element={<EventRegistrationTemp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientLogin/:eventId" element={<ClientLogin />} />
        <Route path="/noauth" element={<ErrorPage title="Access Denied" msg="Log through proper credentials" status={401}/>} />
        <Route path="/clientDashboard" element={<ProtectedClientRoutes>
          <ClientDashboard />
        </ProtectedClientRoutes>} />
        <Route path="/dashboard" element={
          <ProtectedRoutes>
            <DashBoard />
          </ProtectedRoutes>}
        />

      </Routes>
    </HashRouter>
  )
}

export default App