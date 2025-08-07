import { Outlet, Navigate, useLocation } from "react-router-dom";
import type { FC } from "react";
import { useUser } from "@/contexts/UserContext";

const ProtectedRoute: FC = () => {
  const { user, loading, error, finished } = useUser();
  const location = useLocation();
  const redirectUri = encodeURIComponent(location.pathname);

  if (location.pathname === "/reset-password") {
    return <Outlet />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if ((!user || error) && finished) {
    return <Navigate to={`/login?redirect=${redirectUri}`} replace />;
  }

  if (finished) {
    if (user) {
      if (!user.username && location.pathname !== "/onboarding")
        return <Navigate to={`/onboarding?redirect=${redirectUri}`} replace />;
    }
    return <Outlet />;
  }

  return null;
};

export default ProtectedRoute;
