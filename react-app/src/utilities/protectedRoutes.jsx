import {Outlet, Navigate} from 'react-router-dom'
import AuthService from './authService'
import { useEffect, useState } from "react"

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await AuthService.is_authenticated();
      setIsAuthenticated(authStatus);
    }
    checkAuth();
  }, []);

  if (isAuthenticated == null) {
    return (
      <div>Loading...</div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login/" />;
}

export default ProtectedRoutes;
