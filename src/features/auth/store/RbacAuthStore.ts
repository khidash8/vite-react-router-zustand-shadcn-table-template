import { create } from "zustand";
import type {
  AuthState,
  // User,
  Permission,
  UserRole,
  AuditLog,
} from "../types/types.ts";
import { toast } from "sonner";
import {
  type CredentialType,
  DEMO_CREDENTIALS,
  demoUsers,
  // rolePermissions,
} from "../data/demo-user-data.ts";
import { persist } from "zustand/middleware";

export const useRbacAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (username: string, password: string) => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const user = demoUsers.find((u) => u.username === username);
          const isValid =
            DEMO_CREDENTIALS[username as keyof CredentialType] === password;

          if (user && isValid) {
            const updatedUser = {
              ...user,
              lastLogin: new Date().toISOString(),
            };

            set({
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false,
            });

            // Log login activity
            logAuditEvent(user.id, "USER_LOGIN", `User ${username} logged in`);
            toast.success(`Welcome back, ${user.firstName}!`);
          } else {
            set({ isLoading: false });
            toast.error("Invalid credentials!");
          }
        } catch {
          set({ isLoading: false });
          toast.error("Login failed. Please try again.");
        }
      },
      logout: () => {
        const { user } = get();
        if (user) {
          logAuditEvent(
            user.id,
            "USER_LOGOUT",
            `User ${user.username} logged out`,
          );
        }
        set({ user: null, isAuthenticated: false });
        toast.info("You have been logged out.");
      },
      hasPermission: (permission: Permission): boolean => {
        const { user } = get();
        return user?.permissions.includes(permission) || false;
      },
      hasRole: (role: UserRole): boolean => {
        const { user } = get();
        return user?.role === role;
      },
    }),
    {
      name: "rbac-banking-auth-storage",
      partialize: (state: AuthState) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 2, // Incremented for new schema
    },
  ),
);

// Audit logging function
const logAuditEvent = (userId: string, action: string, details: string) => {
  const auditLog: AuditLog = {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
    userId,
    action,
    resource: "AUTH",
    details,
    ipAddress: "127.0.0.1", // In real app, get from request
  };

  // Store in localStorage for demo (in real app, send to backend)
  const existingLogs = JSON.parse(
    localStorage.getItem("rbac_audit_logs") || "[]",
  );
  existingLogs.push(auditLog);
  localStorage.setItem("rbac_audit_logs", JSON.stringify(existingLogs));
};
