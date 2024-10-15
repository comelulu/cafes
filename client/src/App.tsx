// App.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CafeListPage from "./pages/Cafe/CafeListPage";
import CafeDetailPage from "./pages/Cafe/CafeDetailPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCafePage from "./pages/Cafe/CreateCafePage";
import LoginPage from "./pages/Admin/LoginPage";
import AdminManageCafes from "./pages/Admin/AdminManageCafes";
import ProtectedRoute from "./hoc/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";
import Layout from "./components/common/Layout";
import { FavoriteProvider } from "./context/FavoriteProvider";
import EditCafePage from "./pages/Cafe/EditCafePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FavoriteProvider>
        <Layout isDetailPage={false} />
      </FavoriteProvider>
    ),
    children: [
      { path: "/", element: <CafeListPage /> },
      {
        path: "/cafes/:id",
        element: <CafeDetailPage />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/create-cafe",
        element: (
          <ProtectedRoute>
            <CreateCafePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/cafes",
        element: (
          <ProtectedRoute>
            <AdminManageCafes />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/edit-cafe/:id",
        element: (
          <ProtectedRoute>
            <EditCafePage />
          </ProtectedRoute>
        ),
      },
      { path: "/login", element: <LoginPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
