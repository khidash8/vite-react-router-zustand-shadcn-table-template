import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { NavigationGuard } from "./features/auth/components/NavigationGuard.tsx";
import RbacDashboard from "./features/auth/components/RbacDashboard.tsx";
import RbacLoginForm from "./features/auth/components/RbacLoginForm.tsx";
import { NotFound } from "./pages/not-found.tsx";
import HomePage from "./pages/public-pages/Home.tsx";
import { Navigation } from "./components/Navbar.tsx";
import TestPage from "./pages/private-pages/TestPage.tsx";
import { Unauthorized } from "./pages/un-authorized.tsx";

const App = () => {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/login" element={<RbacLoginForm />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />

        <Route path="/" element={<HomePage />} />

        {/* Customer routes */}
        <Route
          path="/dashboard"
          element={
            <NavigationGuard requiredPermission="view_accounts">
              <RbacDashboard />
            </NavigationGuard>
          }
        />

        {/* test/admin routes */}
        <Route
          path="/test-page"
          element={
            <NavigationGuard requiredRole={"admin"}>
              <TestPage />
            </NavigationGuard>
          }
        />

        {/*/!* Teller/Manager routes *!/*/}
        {/*<Route*/}
        {/*  path="/approvals"*/}
        {/*  element={*/}
        {/*    <NavigationGuard requiredPermission="approve_transactions">*/}
        {/*      <ApprovalDashboard />*/}
        {/*    </NavigationGuard>*/}
        {/*  }*/}
        {/*/>*/}

        {/*/!* Admin routes *!/*/}
        {/*<Route*/}
        {/*  path="/admin/users"*/}
        {/*  element={*/}
        {/*    <NavigationGuard requiredRole="admin">*/}
        {/*      <UserManagement />*/}
        {/*    </NavigationGuard>*/}
        {/*  }*/}
        {/*/>*/}

        {/*<Route*/}
        {/*  path="/admin/audit"*/}
        {/*  element={*/}
        {/*    <NavigationGuard requiredPermission="view_audit_logs">*/}
        {/*      <AuditLogs />*/}
        {/*    </NavigationGuard>*/}
        {/*  }*/}
        {/*/>*/}

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
