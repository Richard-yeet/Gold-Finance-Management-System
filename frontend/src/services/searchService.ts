import axiosInstance from "../api/axiosInstance";

export interface SearchResult {
  type: "customer" | "loan";
  id: number;
  title: string;
  subtitle: string;
}

export const searchService = {
  search: (query: string) =>
    axiosInstance.get<SearchResult[]>("/search", { params: { query } }),
};
