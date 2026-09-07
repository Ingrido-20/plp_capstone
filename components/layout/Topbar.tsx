"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useScada, PipelineCompany, FluidType } from "@/context/ScadaContext";
import { pumps, stations } from "@/data/mockData";
import { atRiskPumps } from "@/lib/selectors";

export function Topbar() {
  const { openPump } = useAppContext();
  const {
    selectedCompany,
    setSelectedCompany,
    selectedFluid,
    setSelectedFluid,
    isTelemetryLive,
    setIsTelemetryLive,
    audioMuted,
    setAudioMuted,
    triggerEmergencyTrip,
  } = useScada();

  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(value: string) {
    setQuery(value);
    if (value.trim().length < 2) return;
    const normalized = value.trim().toLowerCase();
    const pumpHit = pumps.find((p) => p.pump_id.toLowerCase().includes(normalized));
    if (pumpHit) {
      openPump(pumpHit.pump_id);
      return;
    }

    const stationHit = stations.find(
      (station) => station.code.toLowerCase().includes(normalized) || station.name.toLowerCase().includes(normalized)
    );
    if (stationHit) router.push("/pumps?station=" + encodeURIComponent(stationHit.code));
  }

  return (
    <header className="glass-light flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
      {/* Search Input & Live Controls */}
      <div className="flex flex-1 items-center gap-3 min-w-[280px]">
        <input
          value={query}
          aria-label="Search pumps, stations, and work orders"
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search pumps, stations, work orders..."
          className="w-full max-w-[320px] rounded-squircle-sm border border-border bg-bg px-3.5 py-2 text-[12.5px] outline-none transition-shadow focus:border-teal focus:ring-2 focus:ring-teal/20"
        />

        {/* Live Telemetry Indicator Toggle */}
        <button
          onClick={() => setIsTelemetryLive(!isTelemetryLive)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-[11.5px] font-bold transition ${
            isTelemetryLive
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
              : "bg-slate-500/10 text-slate-500 border border-slate-300"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isTelemetryLive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
          {isTelemetryLive ? "Live SCADA ON" : "Live SCADA Paused"}
        </button>
      </div>

      {/* Selectors: Pipeline Company & Fluid Type */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Company Dropdown */}
        <div className="flex items-center gap-1 bg-bg border border-border rounded-squircle-sm px-2.5 py-1.5">
          <span className="text-[11px] font-semibold text-text-mute">Network:</span>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value as PipelineCompany)}
            className="bg-transparent text-[12px] font-bold text-text outline-none cursor-pointer"
          >
            <option value="kpc">KPC Line 5 (Mombasa-Kisumu)</option>
            <option value="taps">TAPS (Trans-Alaska Pipeline)</option>
            <option value="petrobras">Petrobras Santos Offshore</option>
            <option value="enbridge">Enbridge Mainline Network</option>
          </select>
        </div>

        {/* Fluid Dropdown */}
        <div className="flex items-center gap-1 bg-bg border border-border rounded-squircle-sm px-2.5 py-1.5">
          <span className="text-[11px] font-semibold text-text-mute">Fluid:</span>
          <select
            value={selectedFluid}
            onChange={(e) => setSelectedFluid(e.target.value as FluidType)}
            className="bg-transparent text-[12px] font-bold text-text outline-none cursor-pointer"
          >
            <option value="ago">AGO Diesel</option>
            <option value="pms">PMS Petrol</option>
            <option value="jeta1">Jet A-1</option>
            <option value="crude">Crude Oil</option>
          </select>
        </div>

        {/* Mute Audio Alarm Toggle */}
        <button
          onClick={() => setAudioMuted(!audioMuted)}
          title={audioMuted ? "Unmute Alarm Sound" : "Mute Alarm Sound"}
          className="px-2.5 py-1.5 rounded-squircle-sm bg-bg border border-border text-[13px] hover:bg-black/[0.04]"
        >
          {audioMuted ? "🔇" : "🔊"}
        </button>

        {/* Emergency Station Trip Button */}
        <button
          onClick={triggerEmergencyTrip}
          className="px-3 py-1.5 rounded-squircle-sm bg-red text-white text-[11.5px] font-bold shadow-soft hover:bg-red/90 transition"
        >
          🚨 Emergency Trip
        </button>
      </div>

      {/* User Profile & Alerts Icon */}
      <div className="flex shrink-0 items-center gap-3 ml-auto">
        <Link
          href="/alerts"
          aria-label={`Active alerts${atRiskPumps.length > 0 ? ` (${atRiskPumps.length})` : ""}`}
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-[15px] transition-colors hover:bg-black/[0.04]"
        >
          ⚠
          {atRiskPumps.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 rounded-pill bg-red px-1.5 py-0 text-[9.5px] font-bold text-white">
              {atRiskPumps.length}
            </span>
          )}
        </Link>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white shadow-soft">
          KPC
        </div>
        <div className="hidden sm:block">
          <div className="text-[12px] font-bold leading-tight">Control Room</div>
          <div className="text-[10px] leading-tight text-text-mute">Engineer / Operator</div>
        </div>
      </div>
    </header>
  );
}
