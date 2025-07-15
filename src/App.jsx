import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
// Pages & Layout
import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotpassword";
import UsersPage from "./routes/sidebar/users";
import Documents from "./routes/sidebar/documents";
import Tasks from "./routes/sidebar/tasks";
import ClientAndCase from "./routes/sidebar/clientandcase";
import Archives from "./routes/sidebar/archives";
import Userlogs from "./routes/sidebar/userlogs";
import Reports from "./routes/sidebar/reports";
import Activity from "./pages/activity";
import Notification from "./routes/sidebar/notification";
import NotificationSettings from "./pages/notif-settings";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "users", element: <UsersPage /> },
        { path: "clients-cases", element: <ClientAndCase /> },
        { path: "tasks", element: <Tasks /> },
        { path: "documents", element: <Documents /> },
        { path: "archives", element: <Archives /> },
        { path: "user-logs", element: <Userlogs /> },
        { path: "notifications", element: <Notification /> },
        { path: "reports", element: <Reports /> },
        { path: "activity", element: <Activity /> },
        { path: "notif-settings", element: <NotificationSettings /> },

      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
