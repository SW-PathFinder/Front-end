import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedProvider } from "@/contexts/AuthenticatedContext";

export const AuthenticatedLayout = () => {
  const { userId, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-xl loading-spinner" />
      </div>
    );
  } else if (!userId) {
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
