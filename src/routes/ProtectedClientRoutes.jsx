import { Navigate } from "react-router-dom";

export function ProtectedClientRoutes({ children }) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'Client') {
        return <Navigate to="/noauth" />;
    }
    
    return children;
}
