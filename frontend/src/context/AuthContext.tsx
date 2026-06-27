import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

interface User {
  username: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "gf_token";
const USERNAME_KEY = "gf_username";

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const username = localStorage.getItem(USERNAME_KEY);
    if (token && username) return { token, username };
    return null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const response = await axiosInstance.post("/auth/login", { username, password });
    const payload = response.data?.data ?? response.data;
    const token: string =
      typeof response.data === "string"
        ? response.data
                : payload?.token ?? payload?.accessToken ?? payload?.jwt ?? "";
    const resolvedUsername: string = payload?.username ?? username;
    if (!token) throw new Error("Invalid login response");
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, resolvedUsername);
    setUser({ username: resolvedUsername, token });
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setUser(null);
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
