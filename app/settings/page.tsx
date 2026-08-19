"use client";

import { useAppContext } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CRIT, WARN } from "@/lib/utils";

const rows: [string, string][] = [
  ["Critical risk threshold", `${(CRIT * 100).toFixed(0)}%`],
  ["Watch threshold", `${(WARN * 100).toFixed(0)}%`],
  ["Prediction horizon", "7 days"],
  ["Rolling feature window", "6 readings (3 hours)"],
  ["Model refresh cadence", "Daily, 06:00 EAT"],
];

export default function SettingsPage() {
  const { showToast } = useAppContext();

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5">
        <h1 className="text-[24px] font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-[13px] text-text-mute">Alert thresholds and model configuration.</p>
      </div>

      <Card className="max-w-[640px]">
        <h3 className="mb-3 text-[14.5px] font-extrabold">Alert thresholds</h3>
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-black/[0.05] py-2 text-[12.5px] last:border-0">
            <span className="text-text-mute">{k}</span>
            <span className="font-bold">{v}</span>
          </div>
        ))}
        <div className="mt-4">
          <Button onClick={() => showToast("Settings saved")}>Save changes</Button>
        </div>
      </Card>
    </div>
  );
}
