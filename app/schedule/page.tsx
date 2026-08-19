"use client";

import { useAppContext } from "@/context/AppContext";
import { atRiskPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { days, stationName } from "@/lib/utils";

export default function SchedulePage() {
  const { openPump } = useAppContext();
  const sorted = atRiskPumps
    .filter((p) => p.rul_hours !== null)
    .sort((a, b) => a.rul_hours! - b.rul_hours!);

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5">
        <h1 className="text-[24px] font-extrabold tracking-tight">Service schedule</h1>
        <p className="mt-1 text-[13px] text-text-mute">Condition-based sequencing — earliest predicted failure first.</p>
      </div>

      <Card padded={false}>
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-[14.5px] font-extrabold">Next 7 days</h3>
          <div className="rounded-squircle-sm border border-border bg-surface px-3 py-1.5 text-[12.5px] font-semibold text-text-mute">
            Week of 13 Aug ▾
          </div>
        </div>
        <div className="overflow-x-auto px-5">
          <table className="w-full min-w-[680px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["#", "Pump", "Station", "Predicted failure", "Confidence band", "Recommended service"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border px-1.5 py-2 text-left text-[11px] font-bold uppercase tracking-wide text-text-mute"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => (
                <tr
                  key={p.pump_id}
                  onClick={() => openPump(p.pump_id)}
                  className="cursor-pointer transition-colors hover:bg-bg"
                >
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5">{i + 1}</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5 font-bold">{p.pump_id}</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5">{stationName(p.station_code)}</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5">in {days(p.rul_hours!)} days</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5">
                    {days(p.rul_ci_low!)}–{days(p.rul_ci_high!)} days
                  </td>
                  <td className="border-b border-black/[0.04] px-1.5 py-2.5">
                    Before day {Math.floor(p.rul_ci_low! / 24)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="m-5 rounded-squircle bg-teal-light p-3.5 text-[12px] text-[#0E6B63]">
          Scheduling against the <b>lower</b> confidence bound rather than the point estimate builds in a safety
          margin — a planner acting on the CI low value is early even in the model&apos;s pessimistic case.
        </div>
      </Card>
    </div>
  );
}
