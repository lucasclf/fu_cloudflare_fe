import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { AppLayout } from "../layout/app-layout";
import { PublicLayout } from "../layout/public-layout";
import { LoadingState } from "@/shared/components/loading-state";

const LoginPage = lazy(() =>
  import("../../features/auth/pages/login-page").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("../../features/auth/pages/register-page").then((m) => ({ default: m.RegisterPage })),
);
const HomePage = lazy(() =>
  import("../../pages/home-page").then((m) => ({ default: m.HomePage })),
);
const CampaignsPage = lazy(() =>
  import("../../features/campaigns/pages/campaigns-page").then((m) => ({ default: m.CampaignsPage })),
);
const CampaignLayout = lazy(() =>
  import("../../features/campaigns/pages/campaign-layout").then((m) => ({ default: m.CampaignLayout })),
);
const CampaignHomePage = lazy(() =>
  import("../../features/campaigns/pages/campaign-home-page").then((m) => ({ default: m.CampaignHomePage })),
);
const CampaignManagePage = lazy(() =>
  import("../../features/campaigns/pages/campaign-manage-page").then((m) => ({ default: m.CampaignManagePage })),
);
const CampaignEntitiesPage = lazy(() =>
  import("../../features/campaigns/pages/campaign-entities-page").then((m) => ({ default: m.CampaignEntitiesPage })),
);
const InvitationsPage = lazy(() =>
  import("../../features/invitations/pages/invitations-page").then((m) => ({ default: m.InvitationsPage })),
);

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<LoadingState />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: withSuspense(<LoginPage />),
  },
  {
    path: "/register",
    element: withSuspense(<RegisterPage />),
  },
  {
    element: <AppLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/home",
            element: withSuspense(<HomePage />),
          },
          {
            path: "/campaigns",
            element: withSuspense(<CampaignsPage />),
          },
          {
            path: "/campaigns/:campaignId",
            element: withSuspense(<CampaignLayout />),
            children: [
              {
                index: true,
                element: withSuspense(<CampaignHomePage />),
              },
              {
                path: "manage",
                element: withSuspense(<CampaignManagePage />),
              },
              {
                path: "entities",
                element: withSuspense(<CampaignEntitiesPage />),
              },
              {
                path: "items",
                element: <Navigate to="../entities" replace />,
              },
            ],
          },
          {
            path: "/invitations",
            element: withSuspense(<InvitationsPage />),
          },
        ],
      },
    ],
  },
]);
