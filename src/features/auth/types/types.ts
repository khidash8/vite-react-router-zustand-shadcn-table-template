// types/types.ts
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  accountType: AccountType;
  isActive: boolean;
  lastLogin?: string;
}

export type UserRole = "customer" | "teller" | "manager" | "admin";
export type AccountType = "checking" | "savings" | "business" | "premium";

export type Permission =
  | "view_accounts"
  | "view_transactions"
  | "create_transactions"
  | "manage_transfers"
  | "view_analytics"
  | "manage_users"
  | "manage_accounts"
  | "approve_transactions"
  | "view_audit_logs"
  | "system_config";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
}

export interface NavigationLink {
  label: string;
  href: string;
  requiredRole?: UserRole;
  requiredPermission?: Permission;
  icon?: string;
}

export type Payment = {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "debit" | "credit";
  category: string;
  status: "completed" | "pending" | "failed" | "under_review";
  account: string;
  approvedBy?: string;
  requiresApproval: boolean;
};

export type TransactionFormData = Omit<Payment, "id">;

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
}
