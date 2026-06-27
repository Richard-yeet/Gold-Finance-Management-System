import axiosInstance from "../api/axiosInstance";
import type { PaymentResponse } from "./loanService";

export interface DashboardData {
  totalActiveLoans: number;
  totalCustomers: number;
  totalOutstandingPrincipal: number;
  totalOutstandingInterest: number;
  totalAmountReceivable: number;
  todaysCollections: number;
  loansDueThisWeek: number;
  bankLoansNearingRenewal: number;
  loansOverdue: number;
  recentTransactions: PaymentResponse[];
  notifications: string[];
}

export const dashboardService = {
  getData: () => axiosInstance.get<DashboardData>("/dashboard"),
};
