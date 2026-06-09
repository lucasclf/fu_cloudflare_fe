import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/app-layout";
import { PublicLayout } from "../layout/public-layout";
import { LoginPage } from "../../features/auth/pages/login-page";
import { RegisterPage } from "../../features/auth/pages/register-page";
import { HomePage } from "../../pages/home-page";
import { CampaignsPage } from "../../features/campaigns/pages/campaigns-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/home",
            element: <HomePage />,
          },
          {
            path: "/campaigns",
            element: <CampaignsPage />,
          },
        ],
      },
    ],
  },
]);
