import axios from "axios";

const BASE_URL = "http://localhost:8053/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gf_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the backend envelope: { success, message, data: { content: [...] } | {...} }
    // Skip unwrapping for blob responses (PDF/CSV exports)
    if (response.config.responseType === "blob") return response;
    const body = response.data;
    if (body && typeof body === "object" && "success" in body) {
      const inner = body.data;
      // Spring paginated list → extract the content array
      if (inner && typeof inner === "object" && Array.isArray(inner.content)) {
        response.data = inner.content;
      } else {
        response.data = inner ?? body;
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("gf_token");
      localStorage.removeItem("gf_username");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
