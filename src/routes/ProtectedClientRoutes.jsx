import { Navigate } from "react-router-dom";

export function ProtectedClientRoutes({ children }) {
    const token = localStorage.getItem('token');
 
    if (!token ) {
        return <Navigate to="/noauth" />;
    }
    
    return children;
}
