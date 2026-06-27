import axiosInstance from "../api/axiosInstance";

export type BankLoanStatus = "ACTIVE" | "RENEWED" | "CLOSED";

export interface BankLoan {
  id: number;
  bankName: string;
  branch: string;
  loanNumber: string;
  loanAmount: number;
  interestRate: number;
  startDate: string;
  renewalDate: string;
  expiryDate: string;
  status: BankLoanStatus;
  notes?: string;
  daysUntilRenewal: number;
}

export interface BankLoanInput {
  bankName: string;
  branch: string;
  loanNumber: string;
  loanAmount: number;
  interestRate: number;
  startDate: string;
  renewalDate: string;
  expiryDate: string;
  status: BankLoanStatus;
  notes?: string;
}

export const bankLoanService = {
  getAll: () => axiosInstance.get<BankLoan[]>("/bank-loans"),

  getById: (id: number) => axiosInstance.get<BankLoan>(`/bank-loans/${id}`),

  create: (data: BankLoanInput) => axiosInstance.post<BankLoan>("/bank-loans", data),

  update: (id: number, data: BankLoanInput) =>
    axiosInstance.put<BankLoan>(`/bank-loans/${id}`, data),

  getRenewals: (days = 90) =>
    axiosInstance.get<BankLoan[]>("/bank-loans/renewals", { params: { days } }),
};
