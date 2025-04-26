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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/eventForm/:eventId" element={<RegistrationForm />} />
        <Route path="/upload" element={<WebcamComponent />} />
        <Route path="/success/:id" element={<SuccessWelcome />} />
        <Route path="/geolocation" element={<GeoLocation />} />
        <Route path="/temp/:eventId" element={<EventRegistrationTemp/>} />

        <Route path="/login" element={<Login />} />
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