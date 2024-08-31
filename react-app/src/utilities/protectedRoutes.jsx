import { Outlet, Navigate } from "react-router-dom";
import AuthService from "./authService";
import { useEffect, useState } from "react";

const ProtectedRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      await AuthService.is_authenticated()
        .then(() => {
          setIsAuthenticated(true)
        })
        .catch(() => {
          setIsAuthenticated(false);
        })
};

checkAuth();
  }, []);

if (isAuthenticated == null) {
  console.log("null");
  return <div>Loading...</div>;
}

return isAuthenticated ? <Outlet /> : <Navigate to="/login/" />;
};

export default ProtectedRoutes;
