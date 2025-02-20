import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (accessToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isAdmin: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkToken = async () => {
    setIsLoading(true); // Mulai loading
    const token = localStorage.getItem("accessToken");
    await new Promise((resolve) => setTimeout(resolve, 700)); // 🕒 Delay 2 detik

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log("✅ Decoded Token:", decoded);
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("⚠️ Token expired");
          logout();
        } else if (decoded.role === "admin") {
          setIsLoggedIn(true);
          setIsAdmin(true);
        } else {
          logout();
        }
      } catch (error) {
        console.error("❌ Token tidak valid:", error);
        logout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
    setIsLoading(false); // Selesai loading
  };

  const login = (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken);
    setIsLoggedIn(true);
    setIsAdmin(true);
    navigate("/admin-dashboard", { replace: true });
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/admin-login", { replace: true });
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
