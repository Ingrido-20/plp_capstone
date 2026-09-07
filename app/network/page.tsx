"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { stations } from "@/data/mockData";
import { useScada } from "@/context/ScadaContext";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { NetworkSvg } from "@/components/dashboard/NetworkSvg";
import { pct } from "@/lib/utils";

export default function NetworkPage() {
  const router = useRouter();
  const { companyInfo, weatherOverlayVisible, setWeatherOverlayVisible } = useScada();
  const [selectedStationCode, setSelectedStationCode] = useState<string>("NK");

  const activeStation = stations.find((s) => s.code === selectedStationCode) || stations[4];

  return (
    <div className="animate-fade-in-up flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Spatiotemporal GIS Pipeline Network</h1>
          <p className="mt-1 text-[13px] text-text-mute">
            {companyInfo.name} — {companyInfo.pipelineLength} interactive node topology ({stations.length} booster stations).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeatherOverlayVisible(!weatherOverlayVisible)}
            className={`px-3.5 py-1.5 rounded-squircle-sm text-xs font-bold transition border ${
              weatherOverlayVisible
                ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                : "bg-surface text-text-mute border-border hover:border-text"
            }`}
          >
            {weatherOverlayVisible ? "🌧 Environmental Vulnerability ON" : "🌧 Enable Soil & River Overlay"}
          </button>
        </div>
      </div>

      {/* Network Topology SVG Map Card */}
      <Card className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-text-mute font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Product Flow Direction: PS1 Mombasa Port Terminal ➔ PS9 Kisumu Depot (1,000,000 L/hr)</span>
          </div>
          <span>Topology Compliance: ISO 9241 HCI</span>
        </div>

        <div className="relative overflow-hidden rounded-squircle border border-border bg-[#0B1120] p-4 text-white">
          <NetworkSvg width={900} height={140} />

          {/* Environmental Overlay Banner if toggled ON */}
          {weatherOverlayVisible && (
            <div className="mt-3 p-3 rounded bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
              <div>
                <strong>🌧 Environmental Exposure Alert:</strong> Thange River crossing area (Km 284) exhibiting high soil moisture porosity & slope erosion exposure.
              </div>
              <span className="text-[10px] uppercase font-bold bg-amber-500 text-black px-2 py-0.5 rounded">High Risk</span>
            </div>
          )}
        </div>
      </Card>

      {/* Station Inspector & Station Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
        {/* Stations Table */}
        <Card padded={false}>
          <div className="p-5 pb-3">
            <h3 className="text-[14.5px] font-extrabold">KPC Station Overview</h3>
          </div>
          <div className="overflow-x-auto px-5 pb-5">
            <table className="w-full min-w-[540px] border-collapse text-[12.5px]">
              <thead>
                <tr>
                  {["Station", "Location", "Distance", "Pumps", "Max Risk", "Status"].map((h) => (
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
                {stations.map((s) => {
                  const isSelected = selectedStationCode === s.code;
                  return (
                    <tr
                      key={s.code}
                      onClick={() => setSelectedStationCode(s.code)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? "bg-teal-light/40 font-bold" : "hover:bg-bg"
                      }`}
                    >
                      <td className="border-b border-black/[0.04] px-2 py-2.5 text-teal">{s.code}</td>
                      <td className="border-b border-black/[0.04] px-2 py-2.5">{s.name}</td>
                      <td className="border-b border-black/[0.04] px-2 py-2.5">{s.km_from_mombasa} km</td>
                      <td className="border-b border-black/[0.04] px-2 py-2.5">{s.pump_count} Units</td>
                      <td className="border-b border-black/[0.04] px-2 py-2.5">{pct(s.max_risk)}</td>
                      <td className="border-b border-black/[0.04] px-2 py-2.5">
                        <RiskBadge risk={s.max_risk} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Station Inspector Detail Drawer */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-1.5">
                  <span>ℹ</span> Station Inspector: {activeStation.code}
                </h3>
                <p className="text-xs text-text-mute">{activeStation.name}</p>
              </div>
              <RiskBadge risk={activeStation.max_risk} />
            </div>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Pipeline Station Code:</span>
                <span className="font-bold">{activeStation.code}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Distance from PS1 Mombasa:</span>
                <span className="font-bold">{activeStation.km_from_mombasa} km</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Active Booster Pumps:</span>
                <span className="font-bold">{activeStation.pump_count} Pumps</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Suction Head Elevation:</span>
                <span className="font-bold">640 meters MSL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Nominal Discharge Pressure:</span>
                <span className="font-bold">48.5 bar</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/[0.05]">
                <span className="text-text-mute">Highest Risk Unit:</span>
                <span className="font-bold text-red">{activeStation.code}-PUMP-04 ({pct(activeStation.max_risk)})</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/pumps?station=${activeStation.code}`)}
            className="mt-5 w-full py-2.5 rounded-squircle-sm bg-teal text-white text-xs font-bold shadow-soft hover:bg-teal/90 transition text-center"
          >
            Inspect Station Pumps →
          </button>
        </Card>
      </div>
    </div>
  );
}
