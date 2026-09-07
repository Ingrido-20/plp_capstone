"use client";

import React from "react";
import { modelMetrics } from "@/data/mockData";
import { useScada } from "@/context/ScadaContext";
import { atRiskPumps } from "@/lib/selectors";
import { Card } from "@/components/ui/Card";
import { days, pct } from "@/lib/utils";

export default function ModelPage() {
  const { telemetry } = useScada();
  const cm = modelMetrics.confusion_matrix;
  const falseAlarm = cm[0][1] / (cm[0][0] + cm[0][1]);
  const minLeadDays = atRiskPumps.length
    ? days(Math.min(...atRiskPumps.filter((p) => p.rul_hours !== null).map((p) => p.rul_hours!)))
    : "—";

  const tiles = [
    { icon: "◐", bg: "bg-teal-light", label: "Classification Accuracy", value: pct(modelMetrics.classification_accuracy) },
    {
      icon: "✓",
      bg: "bg-green-light",
      label: "Model Sensitivity",
      value: pct(modelMetrics.classification_sensitivity),
      trend: "Catastrophic failures caught",
    },
    { icon: "⚠", bg: "bg-amber-light", label: "False Alarm Rate", value: pct(falseAlarm), trend: "Below 5% target" },
    {
      icon: "◷",
      bg: "bg-blue-light",
      label: "RUL Prediction MAE",
      value: `${modelMetrics.rul_mae_hours}h`,
      trend: "Monte Carlo 95% CI bounds",
    },
  ];

  const shapWaterfallFeatures = [
    { feature: "Flowgard Pressure Residual (ΔP)", weight: 0.48, color: "bg-red-500", val: "+0.48" },
    { feature: "Inboard Bearing Temperature drift", weight: 0.32, color: "bg-amber-500", val: "+0.32" },
    { feature: "120Hz BPFO Vibration Amplitude", weight: 0.14, color: "bg-amber-500", val: "+0.14" },
    { feature: "Stator Phase Current Harmonic", weight: 0.04, color: "bg-teal-500", val: "+0.04" },
    { feature: "Suction Head Elevation Factor", weight: 0.02, color: "bg-slate-400", val: "+0.02" },
  ];

  const benchmarks = [
    ["Catch ≥80% of impending failures", pct(modelMetrics.classification_sensitivity)],
    ["Maintain false alarms under 5%", pct(falseAlarm)],
    ["Keep RUL MAE under 90 hours", `${modelMetrics.rul_mae_hours}h`],
    ["Deliver ≥3 days advance warning", `${minLeadDays}d minimum lead time`],
    ["Monte Carlo Dropout 95% Confidence Interval", `RUL = ${telemetry.rulHours.toFixed(1)}h ± ${(telemetry.rulCiHigh - telemetry.rulHours).toFixed(1)}h`],
  ];

  return (
    <div className="animate-fade-in-up flex flex-col gap-6">
      <div>
        <h1 className="text-[24px] font-extrabold tracking-tight">ML Predictions, RUL Bounds & SHAP Explainability</h1>
        <p className="mt-1 text-[13px] text-text-mute">
          Evaluated on 1,000 synthetic KPC pump telemetry runs. XGBoost classifier + Monte Carlo Dropout neural RUL bounds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label} className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm text-[17px] ${t.bg}`}>
              {t.icon}
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-text-mute">{t.label}</div>
              <div className="text-[23px] font-extrabold leading-tight">{t.value}</div>
              {t.trend && <div className="text-[11px] font-semibold text-green">{t.trend}</div>}
            </div>
          </Card>
        ))}
      </div>

      {/* Confusion Matrix & SHAP Feature Drivers */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Confusion Matrix */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="mb-3 text-[14.5px] font-extrabold">Model Confusion Matrix (Validation Set)</h3>
            <table className="w-full border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <th className="border-b border-border py-2 text-left text-[11px] text-text-mute" />
                  <th className="border-b border-border py-2 text-left text-[11px] font-bold uppercase tracking-wide text-text-mute">
                    Predicted Healthy
                  </th>
                  <th className="border-b border-border py-2 text-left text-[11px] font-bold uppercase tracking-wide text-text-mute">
                    Predicted At-Risk
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-black/[0.04] py-2.5 font-bold">Actually Healthy</td>
                  <td className="border-b border-black/[0.04] bg-green-light py-2.5 pl-2 font-extrabold">
                    {cm[0][0].toLocaleString()}
                  </td>
                  <td className="border-b border-black/[0.04] bg-amber-light py-2.5 pl-2 font-extrabold">{cm[0][1]}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold">Actually At-Risk</td>
                  <td className="bg-red-light py-2.5 pl-2 font-extrabold">{cm[1][0]}</td>
                  <td className="bg-green-light py-2.5 pl-2 font-extrabold">{cm[1][1]}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3.5 text-[11.5px] leading-[1.6] text-text-mute">
              The {cm[1][0]} missed failures (false negatives) represent unmitigated breakdown risks. The {cm[0][1]} false alarms represent harmless routine inspection checks.
            </p>
          </div>
        </Card>

        {/* SHAP Waterfall Attribution */}
        <Card className="flex flex-col gap-3">
          <h3 className="text-[14.5px] font-extrabold">Global SHAP Feature Driver Waterfall</h3>
          <p className="text-xs text-text-mute">
            Additive feature attributions showing how individual physical inputs push failure probability.
          </p>

          <div className="flex flex-col gap-3 mt-1">
            {shapWaterfallFeatures.map((item, i) => (
              <div key={i} className="flex flex-col gap-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span className="text-text">{item.feature}</span>
                  <span className="font-mono text-teal">{item.val}</span>
                </div>
                <div className="w-full bg-bg h-2 rounded-full overflow-hidden border border-border">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Benchmarks & Monte Carlo Bounds */}
      <Card>
        <h3 className="mb-3 text-[14.5px] font-extrabold">Objective Model Validation Benchmarks & Monte Carlo Bounds</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          {benchmarks.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-black/[0.05] py-2.5 text-[12.5px]">
              <span className="text-text-mute font-medium">{k}</span>
              <span className="font-bold text-teal">{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
