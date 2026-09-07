"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { useScada } from "@/context/ScadaContext";

export default function LoginPage() {
  const router = useRouter();
  const { companyInfo } = useScada();

  const [email, setEmail] = useState<string>("planner@kpc.co.ke");
  const [password, setPassword] = useState<string>("Password123!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Consume backend FastAPI login endpoint POST /api/v1/users/login
      const response = await apiClient.login(email, password);
      
      if (response && response.access_token) {
        localStorage.setItem("flowguard_jwt_token", response.access_token);
        router.push("/");
      } else {
        // Fallback for offline demo mode
        localStorage.setItem("flowguard_jwt_token", "demo_jwt_token");
        router.push("/");
      }
    } catch {
      // Handle offline or fallback demo mode gracefully
      setErrorMessage("Could not connect to FastAPI server (http://localhost:8000). Entering demo mode...");
      setTimeout(() => {
        localStorage.setItem("flowguard_jwt_token", "demo_jwt_token");
        router.push("/");
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0B1120] border border-slate-800 rounded-2xl p-8 text-slate-100 shadow-2xl flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 text-xl font-bold text-white shadow-lg">
            ◈
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white mt-1">FlowGuard AI</h1>
          <p className="text-xs text-slate-400">
            KPC Industrial Control Room & Hydraulic Reconciliation Engine
          </p>
        </div>

        {/* Error / Offline Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Engineer / Operator Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@kpc.co.ke"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="accent-teal-500 rounded" />
              <span>Remember session</span>
            </label>
            <span className="text-teal-400 hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full py-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating with Backend...</span>
              </>
            ) : (
              <span>Sign In to Control Room →</span>
            )}
          </button>
        </form>

        {/* Quick Demo Login Credentials Bar */}
        <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
            Quick Backend Test Credentials
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => {
                setEmail("planner@kpc.co.ke");
                setPassword("Password123!");
              }}
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-left font-mono"
            >
              <div className="text-teal-400 font-bold">KPC Planner</div>
              <div className="text-[10px] opacity-70">planner@kpc.co.ke</div>
            </button>

            <button
              onClick={() => {
                setEmail("operator@kpc.co.ke");
                setPassword("Password123!");
              }}
              className="p-2 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-left font-mono"
            >
              <div className="text-amber-400 font-bold">KPC Operator</div>
              <div className="text-[10px] opacity-70">operator@kpc.co.ke</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
