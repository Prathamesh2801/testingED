import { HashRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import DashBoard from "./components/DashBoard";
import Login from "./components/Login";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { Toaster } from "react-hot-toast";
import ClientDashboard from "./components/ClientDashboard";
import ClientLogin from "./components/ClientLogin";
import { ProtectedClientRoutes } from "./routes/ProtectedClientRoutes";
import ErrorPage from "./components/ErrorPage";
import QRScanner from "./components/QrScanner";
import FaceDetect from "./components/FaceDetect";

function App() {
  return (
    <HashRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/eventForm/:eventId" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clientLogin/:eventId" element={<ClientLogin />} />
        <Route
          path="/noauth"
          element={
            <ErrorPage
              title="Access Denied"
              msg="Log through proper credentials"
              status={401}
            />
          }
        />

        <Route
          path="/clientDashboard"
          element={
            <ProtectedClientRoutes>
              <ClientDashboard />
            </ProtectedClientRoutes>
          }
        />
        <Route
          path="/qrscan"
          element={
            <ProtectedClientRoutes>
              <QRScanner />
            </ProtectedClientRoutes>
          }
        />
        <Route
          path="/facedetect"
          element={
            <ProtectedClientRoutes>
              <FaceDetect />
            </ProtectedClientRoutes>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <DashBoard />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
