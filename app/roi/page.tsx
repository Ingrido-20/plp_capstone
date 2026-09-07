"use client";

import React, { useState } from "react";
import { modelMetrics } from "@/data/mockData";
import { useScada } from "@/context/ScadaContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { pct } from "@/lib/utils";

export default function RoiPage() {
  const { companyInfo, fluidInfo, selectedFluid, setSelectedFluid } = useScada();

  const [orificeMm, setOrificeMm] = useState<number>(25); // 5mm, 25mm, 50mm
  const [pressureDeltaBar, setPressureDeltaBar] = useState<number>(45); // line pressure delta

  // Hydraulic Orifice Discharge Formula: Q = Cd * A * sqrt(2 * deltaP / rho)
  const Cd = 0.62; // Discharge coefficient
  const areaM2 = Math.PI * Math.pow(orificeMm / 2000, 2); // Orifice area
  const deltaPPa = pressureDeltaBar * 100000; // bar to Pa
  const rho = fluidInfo.densityKgM3; // kg/m3

  const flowM3s = Cd * areaM2 * Math.sqrt((2 * deltaPPa) / rho);
  const flowLhr = flowM3s * 3600 * 1000; // m3/s to L/hr

  const hourlyLossLocal = flowLhr * fluidInfo.pricePerLiterLocal * companyInfo.lossMultiplier;
  const dailyLossLocal = hourlyLossLocal * 24;
  const annualLossLocal = dailyLossLocal * 365;

  const falseAlarm = pct(
    modelMetrics.confusion_matrix[0][1] / (modelMetrics.confusion_matrix[0][0] + modelMetrics.confusion_matrix[0][1])
  );

  const drivers: { name: string; mechanism: string; tone: "watch" | "healthy" | "teal"; status: string }[] = [
    {
      name: "Avoided Emergency Downtime & Catastrophic Failure",
      mechanism: "Early detection shifts repairs from unplanned shutdown to scheduled window — no emergency parts shipping or overtime",
      tone: "teal",
      status: "High ROI Impact",
    },
    {
      name: "Reduced Product Throughput Stoppage",
      mechanism: "Flowgard reconciliation isolates minor degradation precursor 4.2 days before mechanical seizure occurs",
      tone: "teal",
      status: "Validated",
    },
    {
      name: "Optimized Maintenance Technician Dispatch",
      mechanism: `${falseAlarm} low false alarm rate prevents unnecessary station trips across KPC's 1,342 km pipeline`,
      tone: "healthy",
      status: "Validated",
    },
    {
      name: "Environmental Exposure & Class Action Mitigation",
      mechanism: "Prevents high-volume environmental spills at river crossings (Thange/Kiboko River baselines)",
      tone: "watch",
      status: "Strategic Risk Reduction",
    },
  ];

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">Financial Revenue-at-Risk & ROI Business Case</h1>
        <p className="mt-1 text-[13px] text-text-mute">
          Hydraulic leak loss calculations, financial cost asymmetry matrix, and ROI metrics across pipeline networks.
        </p>
      </div>

      {/* Standard Orifice Leak Calculator */}
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h3 className="text-[15px] font-extrabold flex items-center gap-2">
              <span>💧</span> Standard Orifice Fluid Leak Loss Calculator
            </h3>
            <p className="text-xs text-text-mute">
              Physics formula: $Q = C_d \cdot A \cdot \sqrt{\frac{2\Delta P}{\rho}}$ (ISO 5167 Orifice Hydraulic Model)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-mute">Active Network:</span>
            <span className="text-xs font-bold text-teal bg-teal-light px-2.5 py-1 rounded-pill">
              {companyInfo.name} ({companyInfo.currency})
            </span>
          </div>
        </div>

        {/* Calculator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-bg p-4 rounded-squircle border border-border">
          {/* Orifice Size Selector */}
          <div>
            <label className="text-[11.5px] font-bold text-text-mute block mb-1.5">Orifice Breach Size (Diameter):</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { mm: 5, label: "5mm Crack" },
                { mm: 25, label: "25mm Puncture" },
                { mm: 50, label: "50mm Rupture" },
              ].map((item) => (
                <button
                  key={item.mm}
                  onClick={() => setOrificeMm(item.mm)}
                  className={`py-2 px-2 rounded-squircle-sm text-xs font-bold transition border ${
                    orificeMm === item.mm
                      ? "bg-teal text-white border-teal shadow-soft"
                      : "bg-surface text-text border-border hover:border-text-mute"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fluid Selection */}
          <div>
            <label className="text-[11.5px] font-bold text-text-mute block mb-1.5">Fluid Product Type:</label>
            <select
              value={selectedFluid}
              onChange={(e) => setSelectedFluid(e.target.value as any)}
              className="w-full bg-surface text-xs font-bold text-text border border-border rounded-squircle-sm p-2.5 outline-none focus:border-teal"
            >
              <option value="ago">AGO Diesel (Density: 840 kg/m³)</option>
              <option value="pms">PMS Petrol (Density: 740 kg/m³)</option>
              <option value="jeta1">Jet A-1 Aviation Fuel (Density: 800 kg/m³)</option>
              <option value="crude">Light Sweet Crude Oil (Density: 870 kg/m³)</option>
            </select>
          </div>

          {/* Line Pressure Delta Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11.5px] font-bold text-text-mute">Line Delta Pressure (ΔP):</label>
              <span className="text-xs font-bold text-teal">{pressureDeltaBar} bar</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={pressureDeltaBar}
              onChange={(e) => setPressureDeltaBar(Number(e.target.value))}
              className="w-full accent-teal cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-mute mt-1">
              <span>10 bar (Low)</span>
              <span>45 bar (Nominal)</span>
              <span>80 bar (High)</span>
            </div>
          </div>
        </div>

        {/* Calculated Results Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-surface p-4 rounded-squircle border border-border">
            <div className="text-[11.5px] font-semibold text-text-mute">Volumetric Product Loss Rate</div>
            <div className="text-[22px] font-extrabold text-teal mt-0.5">
              {Math.round(flowLhr).toLocaleString()} <span className="text-xs font-normal">L/hr</span>
            </div>
            <div className="text-[11px] text-text-mute mt-1">
              {(flowLhr / 1000).toFixed(1)} m³/hr throughput deficit
            </div>
          </div>

          <div className="bg-surface p-4 rounded-squircle border border-border">
            <div className="text-[11.5px] font-semibold text-text-mute">Hourly Revenue Loss (24h Window)</div>
            <div className="text-[22px] font-extrabold text-red mt-0.5">
              {companyInfo.currencySymbol}
              {Math.round(hourlyLossLocal).toLocaleString()} <span className="text-xs font-normal">/ hr</span>
            </div>
            <div className="text-[11px] text-text-mute mt-1">
              {companyInfo.currencySymbol}
              {Math.round(dailyLossLocal).toLocaleString()} per 24 hours
            </div>
          </div>

          <div className="bg-surface p-4 rounded-squircle border border-border">
            <div className="text-[11.5px] font-semibold text-text-mute">Annualized Revenue-at-Risk</div>
            <div className="text-[22px] font-extrabold text-amber mt-0.5">
              {companyInfo.currencySymbol}
              {(annualLossLocal / 1000000).toFixed(2)}M <span className="text-xs font-normal">/ yr</span>
            </div>
            <div className="text-[11px] text-text-mute mt-1">Direct unmitigated loss exposure</div>
          </div>
        </div>
      </Card>

      {/* ROI Cost Asymmetry Matrix Card */}
      <Card className="flex flex-col gap-4">
        <h3 className="text-[15px] font-extrabold">Financial Cost Asymmetry Matrix (Risk vs Preventive Maintenance)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-green-500/10 border border-green-500/30 rounded-squircle p-4">
            <div className="text-xs font-bold text-green uppercase tracking-wide">1. Preventive Bearing Maintenance</div>
            <div className="text-[24px] font-extrabold text-green mt-1">KES 1,000</div>
            <p className="text-xs text-text-mute mt-1.5 leading-relaxed">
              Standard SKF 22220 EK spherical roller bearing replacement during a planned 4-hour maintenance window.
            </p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-squircle p-4">
            <div className="text-xs font-bold text-amber uppercase tracking-wide">2. Unplanned Catastrophic Spill Cleanup</div>
            <div className="text-[24px] font-extrabold text-amber mt-1">KES 103,000,000+</div>
            <p className="text-xs text-text-mute mt-1.5 leading-relaxed">
              Direct environmental remediation, soil flushing, and river basin restoration (historical KPC Kiboko baseline).
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-squircle p-4">
            <div className="text-xs font-bold text-red uppercase tracking-wide">3. Class-Action Legal Exposure</div>
            <div className="text-[24px] font-extrabold text-red mt-1">KES 25,000,000,000</div>
            <p className="text-xs text-text-mute mt-1.5 leading-relaxed">
              Long-term agricultural liability, groundwater contamination class-action suits, and regulatory fines.
            </p>
          </div>
        </div>
      </Card>

      {/* Value Drivers Table */}
      <Card padded={false}>
        <div className="p-5 pb-3">
          <h3 className="text-[14.5px] font-extrabold">FlowGuard AI Value Drivers</h3>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Value Driver", "Mechanism", "Impact Status"].map((h) => (
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
              {drivers.map((d) => (
                <tr key={d.name} className="transition-colors hover:bg-bg">
                  <td className="border-b border-black/[0.04] px-2 py-3 font-bold">{d.name}</td>
                  <td className="border-b border-black/[0.04] px-2 py-3 text-text-mute max-w-md">{d.mechanism}</td>
                  <td className="border-b border-black/[0.04] px-2 py-3">
                    <Badge tone={d.tone}>{d.status}</Badge>
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
