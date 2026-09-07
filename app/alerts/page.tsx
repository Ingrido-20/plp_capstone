"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useScada } from "@/context/ScadaContext";
import { atRiskPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RiskBadge } from "@/components/ui/Badge";
import { WARN, days, pct, riskColorVar, stationName } from "@/lib/utils";

export default function AlertsPage() {
  const { openPump, showToast } = useAppContext();
  const {
    customAlerts,
    addCustomAlert,
    triggerEmergencyTrip,
    playAlarmBeep,
    audioMuted,
    setAudioMuted,
  } = useScada();

  const handleTestPushNotification = () => {
    playAlarmBeep();
    addCustomAlert(
      "CRITICAL PRECURSOR: Vibration Spike 5.1 mm/s on PS7 Nakuru Booster Pump 4",
      "critical"
    );
    showToast("Test browser push notification dispatched.");
  };

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-tight">
            Live Command Control & Emergency Alert Center
          </h1>
          <p className="mt-1 text-[13px] text-text-mute">
            {atRiskPumps.length} pumps above {(WARN * 100).toFixed(0)}% risk threshold. Real-time alert feed & Web Audio alarm synthesizer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setAudioMuted(!audioMuted)}>
            {audioMuted ? "🔇 Unmute Alarms" : "🔊 Mute Alarms"}
          </Button>

          <Button size="sm" onClick={handleTestPushNotification}>
            🔔 Test Push Alert
          </Button>

          <button
            onClick={triggerEmergencyTrip}
            className="px-3.5 py-1.5 rounded-squircle-sm bg-red text-white text-xs font-bold shadow-soft hover:bg-red/90 transition"
          >
            🚨 Emergency Trip Switch
          </button>
        </div>
      </div>

      {/* Real-time Custom Alert Feed Banner */}
      {customAlerts.length > 0 && (
        <Card className="flex flex-col gap-2.5 bg-slate-900 border border-slate-800 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold flex items-center gap-2 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-red animate-ping" />
              Real-Time Severity-Coded Notification Feed
            </h3>
            <span className="text-xs text-slate-400 font-mono">{customAlerts.length} events logged</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {customAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                  alert.severity === "critical"
                    ? "bg-red-950/50 border-red-500/50 text-red-200"
                    : alert.severity === "warning"
                      ? "bg-amber-950/50 border-amber-500/50 text-amber-200"
                      : "bg-slate-800/80 border-slate-700 text-slate-300"
                }`}
              >
                <div className="font-semibold">{alert.title}</div>
                <div className="text-[10px] opacity-80 whitespace-nowrap">{alert.time}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Flagged Pump Fleet Alert List */}
      <div className="space-y-3">
        <h3 className="text-[15px] font-extrabold">Active Flagged Pump Alerts ({atRiskPumps.length})</h3>

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
                  {p.station_code} — {stationName(p.station_code)} · Top Driver:{" "}
                  <span className="font-bold text-text">{p.shap_top_features[0].feature.replace(/_/g, " ")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div>
                <div className="text-[11.5px] font-semibold text-text-mute">7-day Risk</div>
                <div className="text-[15px] font-extrabold" style={{ color: riskColorVar(p.risk_probability) }}>
                  {pct(p.risk_probability)}
                </div>
              </div>
              <div>
                <div className="text-[11.5px] font-semibold text-text-mute">Remaining Useful Life</div>
                <div className="text-[15px] font-extrabold">
                  {p.rul_hours !== null ? `${days(p.rul_hours)} days` : "—"}
                </div>
              </div>
              <Button size="sm" onClick={() => openPump(p.pump_id)}>
                Inspect 3D Component
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
