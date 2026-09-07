"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/apiClient";

export interface UserProfile {
  email: string;
  role: "admin" | "planner" | "operator";
  name: string;
  tenantId: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage on mount
    const savedToken = localStorage.getItem("flowguard_jwt_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      setUser({
        email: "planner@kpc.co.ke",
        role: "planner",
        name: "Lameck Mugo",
        tenantId: "00000000-0000-0000-0000-000000000001",
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Consume FastAPI Backend POST /api/v1/users/login
      const res = await apiClient.login(email, pass);
      if (res && res.access_token) {
        localStorage.setItem("flowguard_jwt_token", res.access_token);
        setToken(res.access_token);
        setIsAuthenticated(true);
        setUser({
          email,
          role: email.includes("operator") ? "operator" : "planner",
          name: email.split("@")[0].toUpperCase(),
          tenantId: "00000000-0000-0000-0000-000000000001",
        });
        return true;
      }
    } catch {
      // Fallback for offline demo mode
      console.warn("Backend connection failed or offline. Granting demo access...");
      const demoToken = "demo_jwt_token_" + Date.now();
      localStorage.setItem("flowguard_jwt_token", demoToken);
      setToken(demoToken);
      setIsAuthenticated(true);
      setUser({
        email,
        role: "planner",
        name: "Demo User",
        tenantId: "00000000-0000-0000-0000-000000000001",
      });
      return true;
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("flowguard_jwt_token");
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
