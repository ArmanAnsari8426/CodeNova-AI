import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/redux/hooks";
import type { UserRole } from "@/redux/slices/authSlice";

interface Props {
  children: React.ReactNode;
  roles?: UserRole[];
}

/**
 * ProtectedRoute
 * - Redirects to /login if user is not authenticated
 * - Optionally checks allowed roles
 */
export function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * GuestRoute
 * - Redirects authenticated users away from login/signup pages
 */
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}
