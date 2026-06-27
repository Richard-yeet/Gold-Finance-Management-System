import axiosInstance from "../api/axiosInstance";

export interface Customer {
  id: number;
  customerCode: string;
  name: string;
  phoneNumber: string;
  alternativePhone?: string;
  address: string;
  governmentIdNumber: string;
  createdAt?: string;
}

export interface CustomerInput {
  name: string;
  phoneNumber: string;
  alternativePhone?: string;
  address: string;
  governmentIdNumber: string;
}

export const customerService = {
  getAll: (query?: string) =>
    axiosInstance.get<Customer[]>("/customers", { params: query ? { query } : undefined }),

  getById: (id: number) => axiosInstance.get<Customer>(`/customers/${id}`),

  create: (data: CustomerInput) => axiosInstance.post<Customer>("/customers", data),

  update: (id: number, data: CustomerInput) => axiosInstance.put<Customer>(`/customers/${id}`, data),

  getLoans: (id: number) => axiosInstance.get(`/customers/${id}/loans`),
};
