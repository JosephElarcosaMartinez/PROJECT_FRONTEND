import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "react-hot-toast";

// Pages & Layout
import Layout from "./routes/layout";
import ProtectedRoute from "./components/protected-route";

import DashboardPage from "./routes/dashboard/page";
import Login from "./auth/login";
import ForgotPassword from "./auth/forgotpassword";
import Users from "./routes/sidebar/users";
import Documents from "./routes/sidebar/documents";
import Tasks from "./routes/sidebar/tasks";
import Cases from "./routes/sidebar/cases";
import Archives from "./routes/sidebar/archives";
import Userlogs from "./routes/sidebar/user-logs";
import Reports from "./routes/sidebar/reports";
import Notification from "./components/notification";
import NotificationSettings from "./components/notif-settings";
import { ChangePass } from "./auth/changepass";
import Verify from "./auth/verification";
import Register from "./components/registration";
import Clients from "./routes/sidebar/clients";
import { UnauthorizedAccess } from "./auth/unauthorized";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/forgot-password",
            element: <ForgotPassword />,
        },
        {
            path: "/verify",
            element: <Verify />,
        },
        {
            path: "/change-password",
            element: <ChangePass />,
        },
        {
            path: "register",
            element: <Register />,
        },
        {
            path: "unauthorized",
            element: <UnauthorizedAccess />,
        },
        {
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        { index: true, element: <DashboardPage /> },
                        { path: "cases", element: <Cases /> },
                        { path: "documents", element: <Documents /> },
                        { path: "clients", element: <Clients /> },
                        { path: "tasks", element: <Tasks /> },
                        { path: "users", element: <Users /> },
                        { path: "reports", element: <Reports /> },
                        { path: "user-logs", element: <Userlogs /> },
                        { path: "case-archive", element: <Archives /> },
                        { path: "notifications", element: <Notification /> },
                        { path: "notifications/notif-settings", element: <NotificationSettings /> },
                    ],
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <AuthProvider>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    );
}
