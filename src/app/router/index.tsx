import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layout/public-layout";
import { HomePage } from "../../features/hub/pages/home-page";
import { SessionsListPage } from "../../features/sessions/pages/sessions-list-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "sessions",
        element: <SessionsListPage />,
      },
    ],
  },
]);