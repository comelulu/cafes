// App.js
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CafeListPage from "./pages/CafeListPage";
import CafeDetailPage from "./pages/CafeDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreateCafePage from "./pages/CafeCreatePage";
import LoginPage from "./pages/LoginPage";
import AdminManageCafes from "./pages/AdminManageCafes";
import ProtectedRoute from "./hoc/ProtectedRoute";
import NotFoundPage from "./components/NotFoundPage";
import Layout from "./components/Common/Layout";
import { FavoriteProvider } from "./context/FavoriteProvider";
import EditCafePage from "./pages/CafeEditPage";

const routes = [
  {
    path: "/",
    element: <CafeListPage />,
  },
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
];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <FavoriteProvider>
        <Layout isDetailPage={false} />
      </FavoriteProvider>
    ),
    children: routes,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
