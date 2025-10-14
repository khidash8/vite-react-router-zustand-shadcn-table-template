import type { Permission, UserRole } from "../types/types";
import { useRbacAuthStore } from "../store/RbacAuthStore.ts";

export const usePermissions = () => {
  const { hasPermission, hasRole, user } = useRbacAuthStore();

  const can = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  const is = (role: UserRole): boolean => {
    return hasRole(role);
  };

  const canAny = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  const canAll = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    can,
    is,
    canAny,
    canAll,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
  };
};
