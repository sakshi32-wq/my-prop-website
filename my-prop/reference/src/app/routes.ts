import { createBrowserRouter, redirect } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { DashboardLayout } from "./components/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Websites } from "./pages/Websites";
import { WebsiteBuilder } from "./pages/WebsiteBuilder";
import { Leads } from "./pages/Leads";
import { Campaigns } from "./pages/Campaigns";
import { AIStudio } from "./pages/AIStudio";
import { Analytics } from "./pages/Analytics";
import { Templates } from "./pages/Templates";
import { Settings } from "./pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/builder",
    loader: () => redirect("/app/websites"),
  },
  {
    path: "/app",
    Component: DashboardLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "websites", Component: Websites },
      { path: "websites/:id/builder", Component: WebsiteBuilder },
      { path: "leads", Component: Leads },
      { path: "campaigns", Component: Campaigns },
      { path: "ai-studio", Component: AIStudio },
      { path: "analytics", Component: Analytics },
      { path: "templates", Component: Templates },
      { path: "settings", Component: Settings },
    ],
  },
]);