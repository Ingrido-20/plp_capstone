"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { pumps } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { RiskBadge } from "@/components/ui/Badge";
import { criticalPumps, atRiskPumps } from "@/lib/selectors";
import { pct, days, sortByRiskDesc, stationName } from "@/lib/utils";
import ThreePumpVisualizer from "@/components/pumps/ThreePumpVisualizer";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "watch", label: "Watch" },
  { key: "healthy", label: "Healthy" },
] as const;

export function PumpFleetView() {
  const { openPump } = useAppContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get("filter") ?? "all";
  const station = searchParams.get("station");
  const activeKey = station ?? filter;

  function setFilter(key: string) {
    router.push(key === "all" ? "/pumps" : `/pumps?filter=${key}`);
  }

  let list = pumps;
  if (station) list = pumps.filter((p) => p.station_code === station);
  else if (filter === "critical") list = criticalPumps;
  else if (filter === "watch") list = atRiskPumps.filter((p) => p.risk_probability <= 0.5);
  else if (filter === "healthy") list = pumps.filter((p) => p.risk_probability <= 0.15);

  list = sortByRiskDesc(list);

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">Pump Fleet & Interactive 3D Assembly Inspector</h1>
        <p className="mt-1 text-[13px] text-text-mute">
          Real-time diagnostics across {pumps.length} centrifugal pump units. Click any row or inspect the 3D model below.
        </p>
      </div>

      {/* 3D WebGL Centrifugal Pump Visualizer */}
      <ThreePumpVisualizer />

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        {FILTERS.map((f) => (
          <Chip key={f.key} active={!station && activeKey === f.key} onClick={() => setFilter(f.key)}>
            {f.label} (
            {f.key === "all"
              ? pumps.length
              : f.key === "critical"
                ? criticalPumps.length
                : f.key === "watch"
                  ? atRiskPumps.length - criticalPumps.length
                  : pumps.length - atRiskPumps.length}
            )
          </Chip>
        ))}
        {station && <Chip active onClick={() => setFilter("all")}>{station} ×</Chip>}
      </div>

      {/* Fleet Table */}
      <Card padded={false}>
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Pump", "Station", "Risk", "RUL", "Flowgard HDI", "Vibration", "Pressure", "Status"].map((h) => (
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
              {list.map((p) => (
                <tr
                  key={p.pump_id}
                  onClick={() => openPump(p.pump_id)}
                  className="cursor-pointer transition-colors hover:bg-bg"
                >
                  <td className="border-b border-black/[0.04] px-2 py-2.5 font-bold text-teal">{p.pump_id}</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">{stationName(p.station_code)}</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5 font-bold">{pct(p.risk_probability)}</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">
                    {p.rul_hours !== null ? `${days(p.rul_hours)}d (${p.rul_hours}h)` : "—"}
                  </td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5 font-mono">{p.health_deviation_index.toFixed(2)}</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">{p.sensors.vibration_g} g</td>
                  <td className="border-b border-black/[0.04] px-2 py-2.5">{p.sensors.pressure_bar} bar</td>
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
