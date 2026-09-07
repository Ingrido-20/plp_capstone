"use client";

import React from "react";
import { pumps } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { useScada, FaultMode } from "@/context/ScadaContext";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { atRiskPumps, healthyPumps } from "@/lib/selectors";
import { riskColorVar, stationName } from "@/lib/utils";

export default function FlowgardPage() {
  const { openPump } = useAppContext();
  const { telemetry, activeFault, setFaultMode, isTelemetryLive, setIsTelemetryLive } = useScada();

  const avgHealthy = healthyPumps.reduce((s, p) => s + p.health_deviation_index, 0) / healthyPumps.length;
  const avgRisk = atRiskPumps.reduce((s, p) => s + p.health_deviation_index, 0) / atRiskPumps.length;
  const ranked = [...pumps].sort((a, b) => b.health_deviation_index - a.health_deviation_index).slice(0, 14);

  const faultButtons: Array<{ id: FaultMode; label: string; desc: string; color: string }> = [
    {
      id: "normal",
      label: "Normal Flow Baseline",
      desc: "Nominal operational hydraulic balance with near-zero pressure residual",
      color: "border-emerald-500 text-emerald-400 bg-emerald-950/30",
    },
    {
      id: "bearing",
      label: "Bearing Friction Drift",
      desc: "Thermal rise + 120Hz BPFO vibration signature & progressive residual drift (-1.8 bar)",
      color: "border-red-500 text-red-400 bg-red-950/30",
    },
    {
      id: "cavitation",
      label: "Impeller Cavitation Spike",
      desc: "Suction pressure drop + random high-frequency noise & dynamic residual instability (-3.5 bar)",
      color: "border-amber-500 text-amber-400 bg-amber-950/30",
    },
    {
      id: "leak",
      label: "Leak Precursor Loss",
      desc: "Sustained negative hydraulic pressure differential (-6.2 bar) indicating fluid loss",
      color: "border-purple-500 text-purple-400 bg-purple-950/30",
    },
  ];

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">Flowgard Hydraulic Reconciliation Engine</h1>
        <p className="mt-1 text-[13px] text-text-mute">
          Physics-referenced pressure residual calculation ($P_{\text{actual}} - P_{\text{simulated}}$) for isolating mechanical equipment wear from hydraulic pipeline transients.
        </p>
      </div>

      {/* Physics Overview Card */}
      <div className="glass-dark rounded-squircle-lg p-5 text-[#dce6f2] shadow-elevated border border-white/[0.08]">
        <div className="text-[13px] leading-[1.75]">
          <b className="text-white">Hydraulic Reconciliation Principles:</b> For every booster pump across KPC Line 5, Flowgard continuously calculates the theoretical discharge pressure given real-time motor current and fluid density. The gap between actual SCADA pressure readings and simulated physical baseline yields the <b>Health Deviation Index (HDI)</b>:
          <div className="my-3 rounded-squircle bg-white/[0.08] p-4 font-mono text-[12.5px] text-[#8FE3D6] flex flex-col gap-1.5 border border-white/[0.05]">
            <div>Pressure Residual ΔP = Actual Pressure (P_actual) − Physical Baseline Simulation (P_simulated)</div>
            <div>Health Deviation Index (HDI) = Rolling Mean |ΔP| ÷ Calibration Baseline Constant</div>
          </div>
          This equips the machine learning classifier with physical anomaly metrics alongside statistical rolling-window time-series features.
        </div>
      </div>

      {/* Interactive Synthetic Fault Injector Panel */}
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-[15px] font-extrabold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal animate-pulse" />
              Interactive Synthetic Fault Injector
            </h3>
            <p className="text-xs text-text-mute">
              Test live hydraulic reconciliation response under 4 simulated operational degradation modes
            </p>
          </div>

          <button
            onClick={() => setIsTelemetryLive(!isTelemetryLive)}
            className={`px-3 py-1.5 rounded-squircle-sm text-xs font-bold transition border ${
              isTelemetryLive
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                : "bg-slate-500/10 text-slate-500 border-slate-300"
            }`}
          >
            {isTelemetryLive ? "● SCADA Telemetry Stream Active" : "⏸ Stream Paused"}
          </button>
        </div>

        {/* Fault Selector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {faultButtons.map((f) => {
            const isActive = activeFault === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFaultMode(f.id)}
                className={`p-3.5 rounded-squircle border text-left flex flex-col justify-between transition ${
                  isActive
                    ? `${f.color} ring-2 ring-teal/30 shadow-soft`
                    : "bg-bg border-border text-text-mute hover:border-text-mute hover:text-text"
                }`}
              >
                <div>
                  <div className="font-bold text-[13px] text-text flex items-center justify-between">
                    {f.label}
                    {isActive && <span className="text-[10px] bg-teal text-white px-2 py-0.5 rounded-pill font-bold">Active</span>}
                  </div>
                  <div className="text-[11.5px] mt-1.5 leading-snug text-text-mute">{f.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Telemetry Display Gauge Strip */}
        <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-3 bg-bg p-4 rounded-squircle border border-border">
          <div>
            <div className="text-[11px] font-semibold text-text-mute">Vibration Velocity</div>
            <div className="text-[18px] font-extrabold text-red">{telemetry.vibration.toFixed(2)} mm/s</div>
            <div className="text-[10px] text-text-mute">Limit: 4.5 mm/s</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-text-mute">Bearing Temp</div>
            <div className="text-[18px] font-extrabold text-amber">{telemetry.temperature.toFixed(1)} °C</div>
            <div className="text-[10px] text-text-mute">Limit: 75.0 °C</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-text-mute">Line Pressure</div>
            <div className="text-[18px] font-extrabold text-teal">{telemetry.pressure.toFixed(2)} bar</div>
            <div className="text-[10px] text-text-mute">Baseline: 50.0 bar</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-text-mute">Motor Current</div>
            <div className="text-[18px] font-extrabold text-text">{telemetry.motorCurrent.toFixed(1)} A</div>
            <div className="text-[10px] text-text-mute">Rating: 350.0 A</div>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-text-mute">Pressure Residual ΔP</div>
            <div
              className={`text-[18px] font-extrabold ${
                telemetry.flowgardResidual < -2.0 ? "text-red" : "text-emerald-600"
              }`}
            >
              {telemetry.flowgardResidual.toFixed(2)} bar
            </div>
            <div className="text-[10px] text-text-mute">Target: ±0.20 bar</div>
          </div>
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm bg-green-light text-[17px]">
            ✓
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-text-mute">Mean HDI — Healthy Pumps</div>
            <div className="text-[23px] font-extrabold leading-tight">{avgHealthy.toFixed(3)}</div>
            <div className="text-[11px] font-semibold text-green">Baseline Normal</div>
          </div>
        </Card>
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm bg-red-light text-[17px]">
            ⚠
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-text-mute">Mean HDI — Flagged Pumps</div>
            <div className="text-[23px] font-extrabold leading-tight">{avgRisk.toFixed(3)}</div>
            <div className="text-[11px] font-semibold text-red">{(avgRisk / avgHealthy).toFixed(1)}× Baseline</div>
          </div>
        </Card>
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm bg-teal-light text-[17px]">
            ◈
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-text-mute">SHAP Feature Importance</div>
            <div className="text-[23px] font-extrabold leading-tight">#1 Rank</div>
            <div className="text-[11px] font-semibold text-green">Highest Model Weight (+0.48)</div>
          </div>
        </Card>
      </div>

      {/* HDI Pump Fleet Table */}
      <Card padded={false}>
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="text-[14.5px] font-extrabold">Health Deviation Index — All KPC Pump Fleet Units</h3>
          <span className="text-[11px] text-text-mute font-medium">Click any row to open 3D inspector</span>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Pump ID", "Station", "HDI Score", "Deviation vs Baseline", "Status"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-2 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-text-mute"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ranked.map((p) => (
                <tr
                  key={p.pump_id}
                  onClick={() => openPump(p.pump_id)}
                  className="cursor-pointer transition-colors hover:bg-bg"
                >
                  <td className="border-b border-black/[0.04] px-2 py-2.5 font-bold">{p.pump_id}</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">{stationName(p.station_code)}</td>
                  <td
                    className="border-b border-black/[0.04] px-2 py-2.5 font-extrabold font-mono"
                    style={{ color: riskColorVar(p.risk_probability) }}
                  >
                    {p.health_deviation_index.toFixed(3)}
                  </td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5 min-w-[160px]">
                    <ProgressBar value={p.health_deviation_index} max={0.8} />
                  </td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">
                    <RiskBadge risk={p.risk_probability} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
