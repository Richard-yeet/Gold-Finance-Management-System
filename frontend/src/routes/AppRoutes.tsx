import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CustomerListPage from "../pages/customers/CustomerListPage";
import CustomerDetailPage from "../pages/customers/CustomerDetailPage";
import CustomerFormPage from "../pages/customers/CustomerFormPage";
import LoanListPage from "../pages/loans/LoanListPage";
import LoanDetailPage from "../pages/loans/LoanDetailPage";
import LoanFormPage from "../pages/loans/LoanFormPage";
import ReceiptPage from "../pages/loans/ReceiptPage";
import BankLoanListPage from "../pages/bankLoans/BankLoanListPage";
import BankLoanFormPage from "../pages/bankLoans/BankLoanFormPage";
import BankLoanDetailPage from "../pages/bankLoans/BankLoanDetailPage";
import ReportsPage from "../pages/reports/ReportsPage";
import SettingsPage from "../pages/settings/SettingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerFormPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerFormPage />} />

        <Route path="/loans" element={<LoanListPage />} />
        <Route path="/loans/new" element={<LoanFormPage />} />
        <Route path="/loans/:id" element={<LoanDetailPage />} />
        <Route path="/loans/:id/edit" element={<LoanFormPage />} />
        <Route path="/payments/:paymentId/receipt" element={<ReceiptPage />} />

        <Route path="/bank-loans" element={<BankLoanListPage />} />
        <Route path="/bank-loans/new" element={<BankLoanFormPage />} />
        <Route path="/bank-loans/:id" element={<BankLoanDetailPage />} />
        <Route path="/bank-loans/:id/edit" element={<BankLoanFormPage />} />

        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
