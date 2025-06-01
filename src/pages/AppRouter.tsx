import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import UserAuthLayout from "@/components/Common/UserAuthLayout";
import Game from "@/pages/Game";
import LobbyPage from "@/pages/LobbyPage";
import LoginPage from "@/pages/LoginPage";

const AppRouter = () => {
  const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
    {
      element: <UserAuthLayout />,
      children: [
        { path: "/", element: <LobbyPage /> },
        { path: "/game", element: <Game /> },
      ],
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
