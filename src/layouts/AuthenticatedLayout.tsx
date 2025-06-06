import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedProvider } from "@/contexts/AuthenticatedContext";

export const AuthenticatedLayout = () => {
  const { userId } = useAuth();
  const location = useLocation();

  if (!userId) {
    return (
      <Navigate
        to={{ pathname: "/login" }}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return (
    <AuthenticatedProvider userId={userId}>
      <Outlet />
    </AuthenticatedProvider>
  );
};
