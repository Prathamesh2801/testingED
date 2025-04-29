import { Navigate } from "react-router-dom";

export function ProtectedRoutes({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'Admin') {
        return <Navigate to="/login" />;
    }
    
    return children;
}
