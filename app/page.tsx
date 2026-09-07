"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useScada } from "@/context/ScadaContext";

export default function LandingPage() {
  const router = useRouter();
  const { login, isAuthenticated, user } = useAuth();
  const { companyInfo } = useScada();

  const [email, setEmail] = useState<string>("planner@kpc.co.ke");
  const [password, setPassword] = useState<string>("Password123!");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      const success = await login(email, password);
      if (success) {
        setAuthSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setAuthError("Invalid credentials or unauthorized user role.");
      }
    } catch {
      setAuthError("Authentication server error. Entering demo mode...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B15] text-slate-100 -m-6 p-6 sm:p-10 font-sans selection:bg-teal-500 selection:text-black">
      {/* Background Decorative Radial Glowing Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Navigation Bar Header */}
        <header className="flex items-center justify-between py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 text-lg font-bold text-slate-950 shadow-lg shadow-teal-500/20">
              ◈
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-wider text-white">FLOWGUARD AI</span>
              <span className="ml-2.5 text-[10px] uppercase font-bold tracking-widest bg-teal-500/10 text-teal-400 border border-teal-500/30 px-2 py-0.5 rounded-full">
                KPC Enterprise
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="hidden md:inline-block text-slate-400">Team NULL_TERMINATORS • PLP Cohort</span>
            {isAuthenticated ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition shadow-lg shadow-teal-500/20"
              >
                Go to Control Room ({user?.name}) →
              </button>
            ) : (
              <a
                href="#login-card"
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                System Login ↓
              </a>
            )}
          </div>
        </header>

        {/* HERO SECTION WITH FLOATING LOGIN CARD */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4">
          {/* Left Column: Hero Content & System Overview */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-medium text-teal-400 w-fit backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              ISO 9241 HCI Standard Industrial Control Engine
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Condition-Based <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-500 bg-clip-text text-transparent">Predictive Maintenance</span> & Reconciliation
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Operating across Kenya Pipeline Company&apos;s <strong>1,342 km network</strong> (connecting Mombasa, Mtito Andei, Sultan Hamud, Nairobi, Nakuru, and Kisumu), FlowGuard AI replaces fixed-interval maintenance with physics-referenced pressure residuals and 7-day machine learning risk predictions.
            </p>

            {/* Key Metrics Ticker */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur">
                <div className="text-xl sm:text-2xl font-extrabold text-white">1.34B L</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Annual Flow Volume</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur">
                <div className="text-xl sm:text-2xl font-extrabold text-teal-400">94.2%</div>
                <div className="text-[11px] text-slate-400 mt-0.5">ML Model Accuracy</div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur">
                <div className="text-xl sm:text-2xl font-extrabold text-amber-400">4.2 Days</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Advance Warning Lead</div>
              </div>
            </div>
          </div>

          {/* Right Column: FLOATING INTERACTIVE GLASSMORPHISM LOGIN CARD */}
          <div id="login-card" className="lg:col-span-5 relative">
            {/* Glowing Accent Border Container */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-blue-600 rounded-3xl blur-xl opacity-40 animate-pulse" />

            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-7 text-slate-100 shadow-2xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-teal-400">🔑</span> System Access Portal
                  </h2>
                  <p className="text-xs text-slate-400">Enter KPC credentials to unlock Control Room</p>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  FastAPI Auth
                </span>
              </div>

              {/* Error Alert */}
              {authError && (
                <div className="p-3 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* Success Alert */}
              {authSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                  <span>✅</span>
                  <span>Credentials validated! Redirecting to Control Room...</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Engineer / Operator Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="planner@kpc.co.ke"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400 transition"
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
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 w-full py-3 rounded-lg bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Validating Backend Token...</span>
                    </>
                  ) : (
                    <span>Authenticate & Access System →</span>
                  )}
                </button>
              </form>

              {/* Quick Demo Fill Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-center">
                  Quick Backend Test Credentials
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("planner@kpc.co.ke");
                      setPassword("Password123!");
                    }}
                    className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-teal-500/50 text-slate-300 text-left font-mono transition"
                  >
                    <div className="text-teal-400 font-bold">KPC Planner</div>
                    <div className="text-[9.5px] opacity-70">planner@kpc.co.ke</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmail("operator@kpc.co.ke");
                      setPassword("Password123!");
                    }}
                    className="p-2 rounded bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-slate-300 text-left font-mono transition"
                  >
                    <div className="text-amber-400 font-bold">KPC Operator</div>
                    <div className="text-[9.5px] opacity-70">operator@kpc.co.ke</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM CAPABILITY MODULE CARDS */}
        <section className="flex flex-col gap-6 pt-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-extrabold text-white">System Capabilities & Core Modules</h2>
            <p className="text-xs text-slate-400">Integrated predictive maintenance workflow across 13 KPC booster pump stations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: 3D Pump Visualizer */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between gap-4">
              <div>
                <div className="text-2xl mb-2">🔍</div>
                <h3 className="text-sm font-bold text-white">3D WebGL Centrifugal Pump Inspector</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Interactive Three.js WebGL centrifugal pump assembly with raycasting listener, component breakdown & glowing crimson bearing fault state.
                </p>
              </div>
              <Link href="/pumps" className="text-xs font-bold text-teal-400 hover:underline">
                Explore 3D Inspector →
              </Link>
            </div>

            {/* Card 2: Flowgard Hydraulic Engine */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between gap-4">
              <div>
                <div className="text-2xl mb-2">📈</div>
                <h3 className="text-sm font-bold text-white">Flowgard Reconciliation Engine</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Physics pressure residual calculation (P_actual - P_simulated) and 4 synthetic fault injectors (Bearing friction, Cavitation, Leak precursor).
                </p>
              </div>
              <Link href="/flowgard" className="text-xs font-bold text-teal-400 hover:underline">
                Open Engine & Faults →
              </Link>
            </div>

            {/* Card 3: Orifice Leak Calculator */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between gap-4">
              <div>
                <div className="text-2xl mb-2">💧</div>
                <h3 className="text-sm font-bold text-white">Orifice Leak & Financial ROI</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  ISO 5167 orifice leak formula Q = Cd × A × √(2ΔP/ρ) calculating hourly/annual monetary revenue loss across Diesel, Petrol, Jet A-1 & Crude.
                </p>
              </div>
              <Link href="/roi" className="text-xs font-bold text-teal-400 hover:underline">
                Calculate Leak ROI →
              </Link>
            </div>

            {/* Card 4: Command Center */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 transition flex flex-col justify-between gap-4">
              <div>
                <div className="text-2xl mb-2">🚨</div>
                <h3 className="text-sm font-bold text-white">Emergency Command Center</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Web Audio API 880Hz emergency alarm sound synthesizer, station trip isolation switch, and severity-coded alert notification feed.
                </p>
              </div>
              <Link href="/alerts" className="text-xs font-bold text-teal-400 hover:underline">
                View Command Feed →
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 FlowGuard AI • Developed by Team <strong>NULL_TERMINATORS</strong> (KPC Cohort, Inuka Fellowship).
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-white transition">Control Room</Link>
            <Link href="/pumps" className="hover:text-white transition">Pump Fleet</Link>
            <Link href="/flowgard" className="hover:text-white transition">Hydraulic Engine</Link>
            <Link href="/roi" className="hover:text-white transition">Financial ROI</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
