import type { ReactNode } from "react";
import type { Permission, UserRole } from "../types/types";
import { Navigate } from "react-router";
import { useRbacAuthStore } from "../store/RbacAuthStore.ts";

interface NavigationGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  fallbackPath?: string;
}

export const NavigationGuard = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = "/unauthorized",
}: NavigationGuardProps) => {
  const { hasPermission, hasRole, isAuthenticated } = useRbacAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
