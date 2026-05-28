import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "../layout/public-layout";
import { HomePage } from "../../pages/home-page";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);