import axiosInstance from "../api/axiosInstance";

export interface ReportSummary {
  fromDate: string;
  toDate: string;
  totalCollections: number;
  interestCollected: number;
  activeLoans: number;
  closedLoans: number;
  bankLoans: number;
}

export const reportService = {
  getSummary: (from: string, to: string) =>
    axiosInstance.get<ReportSummary>("/reports/summary", { params: { from, to } }),

  exportCollections: (format: "csv" | "pdf", from: string, to: string) =>
    axiosInstance.get("/reports/collections/export", {
      params: { from, to, format },
      responseType: "blob",
    }),
};
