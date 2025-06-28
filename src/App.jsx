import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotpassword";
import UsersPage from "./routes/sidebar/users";
import Documents from "./routes/sidebar/documents";

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
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "users",
          element: <UsersPage />, 
        },
        {
          path: "documents",
          element:<Documents/>,
        },
        {
          path: "cases",
          element: <h1 className="title">Cases</h1>,
        },
        {
          path: "documents",
          element: <h1 className="title">Documents</h1>,
        },
        {
          path: "clients-cases",
          element: <h1 className="title">Clients & Cases</h1>,
        },
        {
          path: "tasks",
          element: <h1 className="title">Tasks</h1>,
        },
        {
          path: "user-logs",
          element: <h1 className="title">User Logs</h1>,
        },
        {
          path: "archives",
          element: <h1 className="title">Archived Cases</h1>,
        },
        {
          path: "notifications",
          element: <h1 className="title">Notifications</h1>,
        },
        {
          path: "reports",
          element: <h1 className="title">Reports</h1>,
        },
        {
          path: "settings",
          element: <h1 className="title">Settings</h1>,
        },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
