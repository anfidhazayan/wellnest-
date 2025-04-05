
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
  const { user, loading } = useAuth();

  // Show loading state if we're still determining if the user is logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="inline-block p-3 bg-medical-100 rounded-full">
            <div className="h-8 w-8 border-4 border-medical-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-medical-700">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected route
  return <Outlet />;
}
