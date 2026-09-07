"use client";

import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import { stations, pumps, modelMetrics } from "@/data/mockData";
import { atRiskPumps, criticalPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { RiskBadge } from "@/components/ui/Badge";
import { NetworkSvg } from "@/components/dashboard/NetworkSvg";
import { days, pct, riskWord, sortByRiskDesc, stationName } from "@/lib/utils";

const statTiles = [
  {
    icon: "⚠",
    iconBg: "bg-red-light",
    label: "Pumps at critical risk",
    value: criticalPumps.length,
    trend: "Requires action this week",
    trendClass: "text-red",
  },
  {
    icon: "◐",
    iconBg: "bg-amber-light",
    label: "Pumps on watch",
    value: atRiskPumps.length - criticalPumps.length,
    trend: "Monitor, no action yet",
    trendClass: "text-text-mute",
  },
  {
    icon: "✓",
    iconBg: "bg-green-light",
    label: "Healthy pumps",
    value: pumps.length - atRiskPumps.length,
    trend: "Operating normally",
    trendClass: "text-green",
  },
];

export default function DashboardPage() {
  const { openPump } = useAppContext();
  const earliestFailure = atRiskPumps.filter((p) => p.rul_hours !== null);
  const earliestDays = earliestFailure.length
    ? days(Math.min(...earliestFailure.map((p) => p.rul_hours!)))
    : null;
  const highestRisk = sortByRiskDesc(pumps).slice(0, 6);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Control room</h1>
          <p className="mt-1 text-[13px] text-text-mute">
            Fleet status across {stations.length} stations, {pumps.length} pumps — Mombasa to Kisumu.
          </p>
        </div>
        <div className="rounded-squircle-sm border border-border bg-surface px-3.5 py-2 text-[12.5px] font-semibold text-text-mute shadow-soft">
          Last model run: today 06:00 ▾
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {statTiles.map((tile) => (
          <Card key={tile.label} className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm text-[17px] ${tile.iconBg}`}>
              {tile.icon}
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-text-mute">{tile.label}</div>
              <div className="text-[23px] font-extrabold leading-tight">{tile.value}</div>
              <div className={`text-[11px] font-semibold ${tile.trendClass}`}>{tile.trend}</div>
            </div>
          </Card>
        ))}
        <Card className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm bg-teal-light text-[17px]">
            ◈
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-text-mute">Earliest predicted failure</div>
            <div className="text-[23px] font-extrabold leading-tight">{earliestDays ? `${earliestDays}d` : "—"}</div>
            <div className="text-[11px] font-semibold text-text-mute">Lead time to act</div>
          </div>
        </Card>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14.5px] font-extrabold">Pipeline network status</h3>
            <Link href="/network" className="text-[13px] font-semibold text-teal hover:underline">
              Open network view →
            </Link>
          </div>
          <NetworkSvg width={700} height={120} />
          <div className="mt-2 flex gap-4 text-[11px] text-text-mute">
            <span className="text-red">● Critical</span>
            <span className="text-amber">● Watch</span>
            <span className="text-green">● Healthy</span>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[14.5px] font-extrabold">Highest risk pumps</h3>
            <Link href="/pumps" className="text-[13px] font-semibold text-teal hover:underline">
              View all ({pumps.length}) →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {highestRisk.map((p) => (
              <div
                key={p.pump_id}
                onClick={() => openPump(p.pump_id)}
                className="flex cursor-pointer items-center justify-between rounded-squircle-sm border border-black/[0.05] p-2.5 transition-colors hover:bg-bg"
              >
                <div>
                  <div className="text-[13px] font-bold">{p.pump_id}</div>
                  <div className="text-[11px] text-text-mute">{stationName(p.station_code)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <RiskBadge risk={p.risk_probability} />
                  <span className="text-[12px] font-bold">{pct(p.risk_probability)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
