import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button.tsx";
import { usePermissions } from "../hooks/usePermissions.ts";
import { useRbacAuthStore } from "../store/RbacAuthStore.ts";

const RbacDashboard = () => {
  const { user } = useRbacAuthStore();
  const { can, is } = usePermissions();

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">RBAC Dashboard</h1>
        <div className="flex items-center gap-2">
          <Badge variant={user?.role === "admin" ? "destructive" : "default"}>
            {user?.role.toUpperCase()}
          </Badge>
          <span>Welcome, {user?.firstName}!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Customer View */}
        {(is("customer") || can("view_accounts")) && (
          <Card>
            <CardHeader>
              <CardTitle>My Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View and manage your bank accounts</p>
            </CardContent>
          </Card>
        )}

        {/* Teller/Manager View */}
        {(is("teller") || is("manager") || can("approve_transactions")) && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Review and approve pending transactions</p>
            </CardContent>
          </Card>
        )}

        {/* Manager View */}
        {(is("manager") || can("view_analytics")) && (
          <Card>
            <CardHeader>
              <CardTitle>Branch Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View branch performance and analytics</p>
            </CardContent>
          </Card>
        )}

        {/* Admin View */}
        {(is("admin") || can("manage_users")) && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage system users and permissions</p>
            </CardContent>
          </Card>
        )}

        {/* Admin View */}
        {(is("admin") || can("view_audit_logs")) && (
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p>View system audit and activity logs</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions based on permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {can("create_transactions") && <Button>New Transaction</Button>}
            {can("manage_transfers") && (
              <Button variant="outline">Transfer Funds</Button>
            )}
            {can("approve_transactions") && (
              <Button variant="secondary">Approve Pending</Button>
            )}
            {can("manage_users") && (
              <Button variant="destructive">Manage Users</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RbacDashboard;
