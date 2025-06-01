import { useEffect } from "react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";

const UserAuthLayout = () => {
  const userId = localStorage.getItem("userId");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId && location.pathname !== "/login") {
      navigate("/login", { state: { from: location.pathname } });
    }
  }, [userId, navigate, location.pathname]);

  return userId ? <Outlet /> : null;
};

export default UserAuthLayout;
