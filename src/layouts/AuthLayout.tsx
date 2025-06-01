import { useEffect } from "react";

import { useNavigate, useLocation, Outlet } from "react-router";

import { useAuth } from "@/contexts/AuthContext";

export const AuthLayout = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId && location.pathname !== "/login") {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userId, navigate, location.pathname]);

  return userId ? <Outlet /> : null;
};
