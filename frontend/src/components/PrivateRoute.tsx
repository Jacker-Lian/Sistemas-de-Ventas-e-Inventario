import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[]; 
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    window.history.replaceState(null, document.title, window.location.pathname);
  }, []);

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.rol_usuario)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
