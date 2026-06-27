import axiosInstance from "../api/axiosInstance";

export type InterestType = "MONTHLY_SIMPLE" | "ANNUAL_SIMPLE" | "COMPOUND";
export type InterestPaymentFrequency = "MONTHLY" | "QUARTERLY";
export type LoanStatus = "ACTIVE" | "CLOSED" | "DEFAULTED";
export type PaymentType = "INTEREST_ONLY" | "PRINCIPAL" | "FULL_SETTLEMENT";
export type JewelleryItemType = "CHAIN" | "RING" | "NECKLACE" | "BRACELET" | "COIN" | "BANGLE" | "EARRINGS" | "OTHER";

export interface JewelleryPhoto {
  id: number;
  url: string;
}

export interface JewelleryItemResponse {
  id: number;
  itemType: JewelleryItemType;
  description: string;
  weightGrams: number;
  estimatedPurity: string;
  estimatedValue: number;
  lockerNumber: string;
  remarks?: string;
  photos?: JewelleryPhoto[];
}

export interface JewelleryItemRequest {
  itemType: JewelleryItemType;
  description: string;
  weightGrams: number;
  estimatedPurity: string;
  estimatedValue: number;
  lockerNumber: string;
  remarks?: string;
}

export interface PaymentResponse {
  id: number;
  loanId: number;
  loanNumber: string;
  receiptNumber: string;
  paymentType: PaymentType;
  amount: number;
  principalComponent?: number;
  interestComponent?: number;
  paymentDate: string;
  notes?: string;
}

export interface PaymentRequest {
  paymentType: PaymentType;
  amount: number;
  paymentDate: string;
  notes?: string;
}

export interface Loan {
  id: number;
  loanNumber?: string;
  customerId: number;
  customerName?: string;
  principalAmount: number;
  interestRate: number;
  interestType: InterestType;
  interestPaymentFrequency: InterestPaymentFrequency;
  loanDate: string;
  closedDate?: string;
  status: LoanStatus;
  outstandingPrincipal?: number;
  outstandingInterest?: number;
  outstandingAmount?: number;
  notes?: string;
  jewelleryItems?: JewelleryItemResponse[];
  payments?: PaymentResponse[];
}

export interface LoanCreateRequest {
  customerId: number;
  jewelleryItems: JewelleryItemRequest[];
  principalAmount: number;
  interestRate: number;
  interestType: InterestType;
  interestPaymentFrequency: InterestPaymentFrequency;
  loanDate: string;
  notes?: string;
}

export interface LoanUpdateRequest {
  interestRate: number;
  interestType: InterestType;
  interestPaymentFrequency: InterestPaymentFrequency;
  status: LoanStatus;
  notes?: string;
}

export const loanService = {
  getAll: (query?: string) =>
    axiosInstance.get<Loan[]>("/loans", { params: query ? { query } : undefined }),

  getById: (id: number) => axiosInstance.get<Loan>(`/loans/${id}`),

  create: (data: LoanCreateRequest) => axiosInstance.post<Loan>("/loans", data),

  update: (id: number, data: LoanUpdateRequest) => axiosInstance.put<Loan>(`/loans/${id}`, data),

  close: (id: number) => axiosInstance.post<Loan>(`/loans/${id}/close`),

  renew: (id: number) => axiosInstance.post<Loan>(`/loans/${id}/renew`),

  recordPayment: (loanId: number, data: PaymentRequest) =>
    axiosInstance.post<PaymentResponse>(`/loans/${loanId}/payments`, data),

  getPayments: (loanId: number) =>
    axiosInstance.get<PaymentResponse[]>(`/loans/${loanId}/payments`),

  getReceipt: (paymentId: number) =>
    axiosInstance.get<string>(`/payments/${paymentId}/receipt`),

  uploadPhoto: (jewelleryItemId: number, formData: FormData) =>
    axiosInstance.post(`/jewellery-items/${jewelleryItemId}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
