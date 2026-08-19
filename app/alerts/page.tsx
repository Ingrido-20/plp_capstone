"use client";

import { useAppContext } from "@/context/AppContext";
import { atRiskPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskBadge } from "@/components/ui/Badge";
import { WARN, days, pct, riskColorVar, stationName } from "@/lib/utils";

export default function AlertsPage() {
  const { openPump, showToast } = useAppContext();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">Active alerts</h1>
          <p className="mt-1 text-[13px] text-text-mute">
            {atRiskPumps.length} pumps above the {(WARN * 100).toFixed(0)}% risk threshold.
          </p>
        </div>
        <Button onClick={() => showToast("Alert digest sent to on-call planner")}>Send digest</Button>
      </div>

      <div className="space-y-3">
        {atRiskPumps.map((p) => (
          <Card key={p.pump_id} className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm text-[17px]"
                style={{ background: p.risk_probability > 0.5 ? "var(--color-red-light)" : "var(--color-amber-light)" }}
              >
                ⚙
              </div>
              <div>
                <div className="flex items-center gap-2 text-[14px] font-extrabold">
                  {p.pump_id}
                  <RiskBadge risk={p.risk_probability} />
                </div>
                <div className="text-[12px] text-text-mute">
                  {p.station_code} — {stationName(p.station_code)} · Top driver:{" "}
                  {p.shap_top_features[0].feature.replace(/_/g, " ")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <div className="text-[11.5px] font-semibold text-text-mute">Risk</div>
                <div className="text-[15px] font-extrabold" style={{ color: riskColorVar(p.risk_probability) }}>
                  {pct(p.risk_probability)}
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold text-text-mute">Lead time</div>
                <div className="text-[15px] font-extrabold">
                  {p.rul_hours !== null ? `${days(p.rul_hours)} days` : "—"}
                </div>
              </div>
              <Button size="sm" onClick={() => openPump(p.pump_id)}>
                Inspect
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
