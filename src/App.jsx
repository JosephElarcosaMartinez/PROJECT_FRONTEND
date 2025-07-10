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
        { path: "notifications", element: <h1 className="title">Notifications</h1> },
        { path: "reports", element: <Reports /> },
      ],
    },
  ]);

  return (
    <ThemeProvider storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
