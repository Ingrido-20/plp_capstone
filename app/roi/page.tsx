import { modelMetrics } from "@/data/mockData";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { pct } from "@/lib/utils";

const heroStats = [
  {
    icon: "⚠",
    bg: "bg-red-light",
    label: "5mm leak, undetected 24h",
    value: "KES 11–15M",
    trend: "Product value alone",
    trendClass: "text-red",
  },
  {
    icon: "◈",
    bg: "bg-amber-light",
    label: "Sinai 2011 — direct cost",
    value: "KES 103M+",
    trend: "From a <KES 1,000 gasket",
    trendClass: "text-red",
  },
  {
    icon: "✓",
    bg: "bg-teal-light",
    label: "Advance warning delivered",
    value: "~4 days",
    trend: "vs. reactive discovery",
    trendClass: "text-green",
  },
];

const theAsk = [
  ["Named engineering contact", "To validate sensor assumptions"],
  ["Aggregated failure records", "Failure counts per station per year"],
  ["Maintenance planner consultation", "Confirm dashboard workflow fit"],
  ["Existing BI infrastructure detail", "Ensure system compatibility"],
  ["Maintenance budget sponsor", "Establish Phase 1 pilot ownership"],
];

export default function RoiPage() {
  const falseAlarm = pct(
    modelMetrics.confusion_matrix[0][1] / (modelMetrics.confusion_matrix[0][0] + modelMetrics.confusion_matrix[0][1])
  );

  const drivers: { name: string; mechanism: string; tone: "watch" | "healthy" | "teal"; status: string }[] = [
    {
      name: "Avoided emergency repair",
      mechanism: "Failures shift from unplanned to scheduled — no emergency parts sourcing or overtime",
      tone: "watch",
      status: "Pending KPC cost data",
    },
    {
      name: "Reduced throughput stoppage",
      mechanism: "Earlier detection shortens the window between onset and intervention",
      tone: "watch",
      status: "Pending KPC cost data",
    },
    {
      name: "Efficient technician deployment",
      mechanism: `${falseAlarm} false alarm rate limits wasted dispatch`,
      tone: "healthy",
      status: "Validated",
    },
    {
      name: "Reduced safety exposure",
      mechanism: "Fewer undetected pressure and mechanical anomalies of the Sinai/Thange/Kiboko type",
      tone: "teal",
      status: "Qualitative, high confidence",
    },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-5">
        <h1 className="text-[24px] font-extrabold tracking-tight">ROI & business case</h1>
        <p className="mt-1 text-[13px] text-text-mute">Value drivers this system affects. Figures pending real KPC cost data.</p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {heroStats.map((s) => (
          <Card key={s.label} className="flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-squircle-sm text-[17px] ${s.bg}`}>
              {s.icon}
            </div>
            <div>
              <div className="text-[11.5px] font-semibold text-text-mute">{s.label}</div>
              <div className="text-[23px] font-extrabold leading-tight">{s.value}</div>
              <div className={`text-[11px] font-semibold ${s.trendClass}`}>{s.trend}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card padded={false} className="mb-4">
        <div className="p-5 pb-3">
          <h3 className="text-[14.5px] font-extrabold">Value drivers</h3>
        </div>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full min-w-[620px] border-collapse text-[12.5px]">
            <thead>
              <tr>
                {["Driver", "Mechanism", "Status"].map((h) => (
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
              {drivers.map((d) => (
                <tr key={d.name}>
                  <td className="border-b border-black/[0.04] px-1.5 py-3 font-bold">{d.name}</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-3 text-text-mute">{d.mechanism}</td>
                  <td className="border-b border-black/[0.04] px-1.5 py-3">
                    <Badge tone={d.tone}>{d.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="mb-3 text-[14.5px] font-extrabold">The KPC ask</h3>
        {theAsk.map(([k, v]) => (
          <div key={k} className="flex justify-between border-b border-black/[0.05] py-2 text-[12.5px] last:border-0">
            <span className="text-text-mute">{k}</span>
            <span className="font-bold">{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
