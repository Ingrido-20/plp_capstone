"use client";

import { useAppContext } from "@/context/AppContext";
import { atRiskPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { days, stationName } from "@/lib/utils";

export default function WorkOrdersPage() {
  const { openPump, showToast } = useAppContext();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Work orders</h1>
          <p className="mt-1 text-[13px] text-text-mute">
            Auto-generated from model output, ranked by remaining useful life.
          </p>
        </div>
        <Button onClick={() => showToast("Work orders exported to CSV")}>Export</Button>
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto p-5">
          <table className="w-full min-w-[760px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["WO ref", "Pump", "Station", "Issue", "Priority", "Due within", "Status"].map((h) => (
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
              {atRiskPumps.map((p, i) => {
                const topDriver = p.shap_top_features[0].feature.replace(/_/g, " ");
                const dominantComponent = Object.entries(p.component_states).sort((a, b) => b[1] - a[1])[0][0];
                return (
                  <tr
                    key={p.pump_id}
                    onClick={() => openPump(p.pump_id)}
                    className="cursor-pointer transition-colors hover:bg-bg"
                  >
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5 font-bold">
                      WO-{String(2401 + i).padStart(4, "0")}
                    </td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5">{p.pump_id}</td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5">{stationName(p.station_code)}</td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5 capitalize">
                      {dominantComponent} — {topDriver}
                    </td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5">
                      {p.risk_probability > 0.5 ? (
                        <Badge tone="critical">P1</Badge>
                      ) : (
                        <Badge tone="watch">P3</Badge>
                      )}
                    </td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5">
                      {p.rul_hours !== null ? `${days(p.rul_hours)} days` : "—"}
                    </td>
                    <td className="border-b border-black/[0.04] px-1.5 py-2.5">
                      <Badge tone="info">Open</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
